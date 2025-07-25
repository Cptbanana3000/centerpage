// src/app/api/analyze/route.js
import { NextResponse } from 'next/server';
import { checkFirebaseRateLimit } from '@/lib/rate-limiter-firebase';
import databaseService from '@/services/database'; 
import requestTracker from '@/services/requestTracker';
import { verifyIdToken } from '@/lib/firebase-admin';
import { 
    calculateDigitalIdentityStrength,
    calculateCompetitionIntensityAI,
    calculateSeoDifficultyAI,
    getBrandUniquenessAI,
    generateAISummary,
    mapScoreToVerdict
} from '@/services/analysisLogic';
import { 
    getDomainAvailability, 
    getGoogleResults 
} from '@/services/apiHelpers';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const brandName = searchParams.get('brandName')?.toLowerCase().trim();
  const category = searchParams.get('category') || 'general'; // Default to 'general' if not provided

  if (!brandName) {
    return NextResponse.json({ message: 'brandName parameter is required' }, { status: 400 });
  }

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

  // --- RATE LIMIT CHECK (Firebase) - USER-BASED ---
  const { success, message } = await checkFirebaseRateLimit(`analyze_user_${userId}`, 10);
  if (!success) {
    return NextResponse.json({ message }, { status: 429 });
  }
  // --- END RATE LIMIT CHECK ---

  try {
    // Include category in cache key for category-specific caching
    const cacheKey = `${brandName.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')}_${category.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    
    // Check for recent duplicate requests before any credit operations
    const isDuplicate = requestTracker.isRecentDuplicateRequest(userId, brandName, category);
    if (isDuplicate) {
      return NextResponse.json({
        message: 'Duplicate request detected. Please wait a moment before submitting again.',
        code: 'DUPLICATE_REQUEST'
      }, { status: 429 }); // 429 Too Many Requests
    }


    
    // IMPORTANT: Check cache BEFORE deducting credits to avoid charging for cached results
    const cachedResult = await databaseService.getCachedAnalysis(cacheKey);
    if (cachedResult) {
      await databaseService.updateHitCount(cacheKey);
      // We still save to the user's history even if it's a cached result
      await databaseService.saveAnalysisToHistory(userId, cacheKey, cachedResult);
      return NextResponse.json(cachedResult);
    }
    
    // Only check and deduct credits if no cached result exists
    const userHasCredits = await databaseService.checkAndDeductCredits(userId, 'standardAnalyses');
    if (!userHasCredits) {
      return NextResponse.json({
        message: 'Insufficient credits. Please purchase a credit pack to continue.',
        code: 'INSUFFICIENT_CREDITS'
      }, { status: 402 }); // 402 Payment Required
    }
    

    
    await databaseService.updateAnalytics('fresh_analysis_started', brandName, { category, userId });

    const tldsToCheck = ['.com', '.io', '.ai', '.co', '.org', '.net'];
    const domainsToCheck = tldsToCheck.map(tld => `${brandName}${tld}`);
    
    // --- NEW: Multi-Query Search Strategy ---
    console.log(`[API] Starting multi-query search for "${brandName}" in category "${category}"`);

    // 1. Primary Search (Exact Brand Name, with quotes) - Finds the main site.
    const exactMatchPromise = getGoogleResults(brandName, true);

    // 2. Secondary Search (Category-Specific, broad match) - Finds niche competitors.
    const categoryQuery = `${brandName} ${category.split(' & ')[0]}`;
    const categoryMatchPromise = getGoogleResults(categoryQuery, false);

    // Await both promises in parallel along with domain check
    const [domainData, exactMatchResults, categoryMatchResults] = await Promise.all([
      getDomainAvailability(domainsToCheck),
      exactMatchPromise,
      categoryMatchPromise,
    ]);

    // 3. Combine and Deduplicate Results
    const combinedResults = [...exactMatchResults, ...categoryMatchResults];
    const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.link, item])).values());
    
    console.log(`[API] Found ${uniqueResults.length} unique Google results (${exactMatchResults.length} exact + ${categoryMatchResults.length} category).`);

    // --- NEW: Perform all AI analyses concurrently for efficiency ---
    const [
        uniquenessScore,
        competitionIntensity,
        seoDifficulty
    ] = await Promise.all([
        getBrandUniquenessAI(uniqueResults, brandName, category),
        calculateCompetitionIntensityAI(uniqueResults, brandName, category),
        calculateSeoDifficultyAI(uniqueResults, category)
    ]);

    // --- UPDATED: Use the new, more advanced scoring function ---
    const domainStrength = calculateDigitalIdentityStrength(domainData, uniqueResults, brandName, category, uniquenessScore);

    // Calculate overall score (weights can be adjusted)
    const overallScore = Math.round(
        (domainStrength * 0.4) +
        (competitionIntensity * 0.4) +
        (seoDifficulty * 0.2)
    );

    const scores = {
        domainStrength,
        competitionIntensity,
        seoDifficulty,
        overallScore
    };
    
    // Generate AI verdict + summary with category context
    const { verdict, summary } = await generateAISummary(scores, brandName, category);

    const analysisRecord = {
      brandName,
      category,
      overallScore: Math.round(overallScore),
      verdict,
      summary,
      recommendation: `${verdict} — ${summary}`,
      scores,
      detailedAnalysis: {
        domainAvailability: domainData.map(d => ({ domain: d.domain, isAvailable: d.available })),
        googleCompetition: { topResults: uniqueResults.slice(0, 5) }
      },
      cached: false,
      analysisTime: new Date().toISOString()
    };
    
    // Cache the new result and save it to user's history
    await databaseService.cacheAnalysis(cacheKey, analysisRecord);
    await databaseService.saveAnalysisToHistory(userId, cacheKey, analysisRecord);

    return NextResponse.json(analysisRecord);

  } catch (error) {
    console.error(`[API Analysis Error] for user ${userId}:`, error);
    // Important: We should ideally refund the credit if the process fails catastrophically
    await databaseService.refundCredit(userId, 'standardAnalyses');
    
    return NextResponse.json(
      { message: 'An unexpected error occurred during the analysis.', error: error.message },
      { status: 500 }
    );
  }
}
