// src/app/api/deep-scan/route.js
import { NextResponse } from 'next/server';
import DeepScanService from '@/services/deepscan';
import databaseService from '@/services/database';
import requestTracker from '@/services/requestTracker';
import { getGoogleResults } from '@/services/apiHelpers';
import { verifyIdToken } from '@/lib/firebase-admin';
import { categorizeCompetitors } from '@/utils/competitorCategorizer';

const deepScanService = new DeepScanService();

export async function POST(request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  // Check for required environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY environment variable');
    return NextResponse.json({ 
      success: false, 
      message: 'Deep scan service is temporarily unavailable. Please try again later.',
      code: 'SERVICE_UNAVAILABLE'
    }, { status: 503 });
  }

  if (!process.env.GOOGLE_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_CX) {
    console.error('Missing Google Search API credentials');
    console.error('GOOGLE_SEARCH_API_KEY present:', !!process.env.GOOGLE_SEARCH_API_KEY);
    console.error('GOOGLE_SEARCH_CX present:', !!process.env.GOOGLE_SEARCH_CX);
    return NextResponse.json({ 
      success: false, 
      message: 'Search service is temporarily unavailable. Please try again later.',
      code: 'SERVICE_UNAVAILABLE'
    }, { status: 503 });
  }

  // Add environment check logging
  console.log('Environment check passed - OPENAI_API_KEY:', !!process.env.OPENAI_API_KEY);
  console.log('Environment check passed - GOOGLE_SEARCH_API_KEY:', !!process.env.GOOGLE_SEARCH_API_KEY);
  console.log('Environment check passed - GOOGLE_SEARCH_CX:', !!process.env.GOOGLE_SEARCH_CX);

  const decodedToken = await verifyIdToken(token);
  if (!decodedToken) {
    return NextResponse.json({ message: 'Invalid authentication token' }, { status: 401 });
  }

  if (!decodedToken.email_verified) {
    return NextResponse.json({ 
      message: 'Email not verified. Please check your inbox for a verification link.',
      code: 'EMAIL_NOT_VERIFIED'
    }, { status: 403 });
  }
  
  const userId = decodedToken.uid;

  try {
    const { brandName, competitorUrls, category } = await request.json();
    
    if (!brandName) {
      return NextResponse.json({ message: 'Missing required parameter: brandName' }, { status: 400 });
    }

    // Check for recent duplicate requests before any credit operations
    const isDuplicate = requestTracker.isRecentDuplicateRequest(userId, `deepscan_${brandName}`, category);
    if (isDuplicate) {
      return NextResponse.json({
        message: 'Duplicate deep scan request detected. Please wait a moment before submitting again.',
        code: 'DUPLICATE_REQUEST'
      }, { status: 429 }); // 429 Too Many Requests
    }

    // Check and deduct deepScans credits
    const userHasCredits = await databaseService.checkAndDeductCredits(userId, 'deepScans');
    if (!userHasCredits) {
      return NextResponse.json({
        message: 'Insufficient Deep Scan credits. Please purchase a credit pack to continue.',
        code: 'INSUFFICIENT_CREDITS'
      }, { status: 402 }); // 402 Payment Required
    }

    await databaseService.updateAnalytics('deep_scan_started', brandName, { category, userId });
    
    let urlsToScan = competitorUrls;
    
    // If no competitor URLs provided, get them from Google search using multi-query strategy
    if (!urlsToScan || urlsToScan.length === 0) {
      console.log(`[Deep Scan] Using multi-query search for "${brandName}" in category "${category}"`);
      
      // 1. Primary Search (Exact Brand Name, with quotes) - Finds the main site.
      const exactMatchPromise = getGoogleResults(brandName, true);

      // 2. Secondary Search (Category-Specific, broad match) - Finds niche competitors.
      const categoryQuery = `${brandName} ${category ? category.split(' & ')[0] : 'business'}`;
      const categoryMatchPromise = getGoogleResults(categoryQuery, false);

      // Await both promises in parallel
      const [exactMatchResults, categoryMatchResults] = await Promise.all([
        exactMatchPromise,
        categoryMatchPromise,
      ]);

      // 3. Combine and Deduplicate Results
      const combinedResults = [...exactMatchResults, ...categoryMatchResults];
      const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.link, item])).values());
      
      console.log(`[Deep Scan] Found ${uniqueResults.length} unique Google results for deep scan.`);
      
      // 4. Categorize competitors intelligently
      const categorizedCompetitors = categorizeCompetitors(brandName, uniqueResults, category);
      
      // 5. Auto-select competitors with smart fallback strategy
      let autoSelectedCompetitors = categorizedCompetitors.filter(comp => 
        comp.threatLevel === 'direct' || 
        (comp.threatLevel === 'indirect' && comp.analysis.productSimilarity > 80)
      );
      
      // Fallback 1: If no direct/indirect threats, include name conflicts that are businesses
      if (autoSelectedCompetitors.length === 0) {
        autoSelectedCompetitors = categorizedCompetitors.filter(comp => 
          comp.threatLevel === 'name-conflict' && comp.analysis.websiteType === 'business'
        );
      }
      
      // Fallback 2: If still nothing, take any business websites (even if unrelated)
      if (autoSelectedCompetitors.length === 0) {
        autoSelectedCompetitors = categorizedCompetitors.filter(comp => 
          comp.analysis.websiteType === 'business'
        );
      }
      
      // Fallback 3: If STILL nothing, take the top informational sources for research
      if (autoSelectedCompetitors.length === 0) {
        autoSelectedCompetitors = categorizedCompetitors.filter(comp => 
          comp.threatLevel === 'informational' || comp.threatLevel === 'discussion'
        ).slice(0, 3);
      }
      
      // If absolutely no usable competitors found, return error
      if (autoSelectedCompetitors.length === 0) {
        return NextResponse.json({
          success: false,
          message: `No analyzable competitors found for "${brandName}". Please use the competitor selection interface to choose specific competitors to analyze.`,
          code: 'NO_AUTO_SELECTION',
          categorizedCompetitors: categorizedCompetitors.slice(0, 10),
          suggestions: [
            'Use the competitor selection interface to manually choose relevant competitors',
            'This might indicate a unique brand opportunity with low competition',
            'Consider trademark searches for comprehensive brand validation'
          ]
        }, { status: 200 });
      }
      
      console.log(`[Deep Scan] Auto-selected ${autoSelectedCompetitors.length} competitors:`, autoSelectedCompetitors.map(c => `${c.link} (${c.threatLevel})`));
      
      urlsToScan = autoSelectedCompetitors.slice(0, 5).map(comp => comp.link);
    }
    
    if (urlsToScan.length === 0) {
      // Refund credit if no competitors found
      await databaseService.refundCredit(userId, 'deepScans');
      return NextResponse.json({ success: false, message: 'No competitors found for analysis' }, { status: 404 });
    }

    // Initialize DeepScanService with error handling for Puppeteer
    let result;
    try {
      result = await deepScanService.performMultipleDeepScan(urlsToScan, brandName, category);
    } catch (serviceError) {
      console.error('DeepScanService error:', serviceError);
      
      // Handle specific Puppeteer/browser errors
      if (serviceError.message.includes('browser') || serviceError.message.includes('puppeteer')) {
        await databaseService.refundCredit(userId, 'deepScans');
        return NextResponse.json({ 
          success: false, 
          message: 'Browser service is temporarily unavailable on our servers. Please try again in a few minutes.',
          code: 'BROWSER_SERVICE_ERROR'
        }, { status: 503 });
      }
      
      // Handle OpenAI API errors
      if (serviceError.message.includes('OpenAI') || serviceError.message.includes('API')) {
        await databaseService.refundCredit(userId, 'deepScans');
        return NextResponse.json({ 
          success: false, 
          message: 'AI analysis service is temporarily unavailable. Please try again later.',
          code: 'AI_SERVICE_ERROR'
        }, { status: 503 });
      }
      
      // Generic service error
      await databaseService.refundCredit(userId, 'deepScans');
      return NextResponse.json({ 
        success: false, 
        message: 'Deep scan service encountered an error. Your credits have been refunded.',
        code: 'SERVICE_ERROR'
      }, { status: 500 });
    }

    if (result.success) {
      await databaseService.saveDeepScanReport(brandName, category, result.data);
      await databaseService.updateAnalytics('deep_scan_completed', brandName, { 
        competitorsAnalyzed: result.data.competitors?.length || 0,
        category,
        userId 
      });
      return NextResponse.json({ success: true, data: result.data });
    } else {
      await databaseService.updateAnalytics('deep_scan_failed', brandName, { 
        error: result.error,
        category,
        userId 
      });
      // Refund credit on failure
      await databaseService.refundCredit(userId, 'deepScans');
      return NextResponse.json({ success: false, error: result.error || 'Deep scan failed' }, { status: 500 });
    }

  } catch (error) {
    console.error('Deep Scan endpoint error:', error);
    // Refund credit on error
    await databaseService.refundCredit(userId, 'deepScans');
    await databaseService.updateAnalytics('deep_scan_error', 'unknown', { error: error.message, userId });
    return NextResponse.json({ success: false, message: 'An error occurred during deep scan analysis' }, { status: 500 });
  }
}

/**
 * Get category-specific keyword for enhanced search
 * @param {string} category - The selected category
 * @returns {string} - Category keyword
 */
function getCategoryKeyword(category) {
  const categoryKeywords = {
    'tech & saas': 'software',
    'e-commerce & retail': 'store',
    'health & wellness': 'health',
    'creative & design': 'design',
    'games & entertainment': 'game',
    'finance & fintech': 'finance',
    'food & beverage': 'food',
    'travel & hospitality': 'travel',
    'education & e-learning': 'education',
    'professional services': 'consulting'
  };

  return categoryKeywords[category.toLowerCase()] || '';
}
