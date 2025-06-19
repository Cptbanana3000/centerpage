// src/app/api/deep-scan/route.js
import { NextResponse } from 'next/server';
import DeepScanService from '@/services/deepscan';
import databaseService from '@/services/database';
import requestTracker from '@/services/requestTracker';
import { getGoogleResults } from '@/services/apiHelpers';
import { verifyIdToken } from '@/lib/firebase-admin';

const deepScanService = new DeepScanService();

export async function POST(request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

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
      urlsToScan = uniqueResults.slice(0, 5).map(result => result.link);
    }
    
    if (urlsToScan.length === 0) {
      // Refund credit if no competitors found
      await databaseService.refundCredit(userId, 'deepScans');
      return NextResponse.json({ success: false, message: 'No competitors found for analysis' }, { status: 404 });
    }

    const result = await deepScanService.performMultipleDeepScan(urlsToScan, brandName, category);

    if (result.success) {
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
