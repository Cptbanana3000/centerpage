// src/app/api/analyze/route.js
import { NextResponse } from 'next/server';
import databaseService from '@/services/database'; 
import { 
    calculateDomainStrength,
    calculateCompetitionIntensityAI,
    calculateSeoDifficultyAI,
    generateAIReportAndRecommendation
} from '@/services/analysisLogic';
import { 
    getDomainAvailability, 
    getGoogleResults 
} from '@/services/apiHelpers';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const brandName = searchParams.get('brandName')?.toLowerCase().trim();
  const category = searchParams.get('category') || 'general'; // Default to 'general' if not provided
  const userId = searchParams.get('userId'); // Optional - for saving to history

  if (!brandName) {
    return NextResponse.json({ message: 'brandName parameter is required' }, { status: 400 });
  }

  try {
    // Include category in cache key for category-specific caching
    const cacheKey = `${brandName}_${category.toLowerCase().replace(/\s+/g, '_')}`;
    const cachedResult = await databaseService.getCachedAnalysis(cacheKey);
    if (cachedResult) {
      await databaseService.updateHitCount(cacheKey);
      return NextResponse.json(cachedResult);
    }
    
    await databaseService.updateAnalytics('fresh_analysis_started', brandName, { category });

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

    // --- The rest of the analysis pipeline uses the corrected `uniqueResults` ---
    const scores = {
      domainStrength: calculateDomainStrength(domainData, brandName, category),
      competitionIntensity: await calculateCompetitionIntensityAI(uniqueResults, brandName, category),
      seoDifficulty: await calculateSeoDifficultyAI(uniqueResults, category)
    };

    const overallScore = (scores.domainStrength * 0.4) + (scores.competitionIntensity * 0.4) + (scores.seoDifficulty * 0.2);
    
    // Generate AI-powered recommendation and insights with category context
    const aiRecommendation = await generateAIReportAndRecommendation({
      ...scores,
      overallScore: Math.round(overallScore)
    }, brandName, category);

    const finalResponse = {
      brandName,
      category,
      overallScore: Math.round(overallScore),
      recommendation: aiRecommendation,
      scores,
      detailedAnalysis: {
        domainAvailability: domainData.map(d => ({ domain: d.domain, isAvailable: d.available })),
        googleCompetition: { topResults: uniqueResults.slice(0, 5) }
      },
      cached: false,
      analysisTime: new Date().toISOString()
    };
    
    await databaseService.cacheAnalysis(cacheKey, finalResponse);
    await databaseService.updateAnalytics('fresh_analysis_completed', brandName, { 
      overallScore: finalResponse.overallScore,
      category 
    });

    // Save to user history if userId is provided
    if (userId) {
      try {
        const historyResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            brandName,
            category,
            overallScore: finalResponse.overallScore,
            scores: finalResponse.scores,
            recommendation: finalResponse.recommendation
          })
        });
        
        if (!historyResponse.ok) {
          console.warn('Failed to save analysis to history:', await historyResponse.text());
        }
      } catch (historyError) {
        console.warn('Error saving to history:', historyError);
        // Don't fail the main request if history saving fails
      }
    }

    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error('Error in /api/analyze route:', error);
    await databaseService.updateAnalytics('analysis_error', brandName, { error: error.message, category });
    return NextResponse.json({ message: 'An error occurred during analysis.' }, { status: 500 });
  }
}
