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

  if (!brandName) {
    return NextResponse.json({ message: 'brandName parameter is required' }, { status: 400 });
  }

  try {
    const cachedResult = await databaseService.getCachedAnalysis(brandName);
    if (cachedResult) {
      await databaseService.updateHitCount(brandName);
      return NextResponse.json(cachedResult);
    }
    
    await databaseService.updateAnalytics('fresh_analysis_started', brandName);

    const tldsToCheck = ['.com', '.io', '.ai', '.co', '.org', '.net'];
    const domainsToCheck = tldsToCheck.map(tld => `${brandName}${tld}`);
    
    const [domainData, googleData] = await Promise.all([
      getDomainAvailability(domainsToCheck),
      getGoogleResults(brandName)
    ]);

    const scores = {
      domainStrength: calculateDomainStrength(domainData, brandName),
      competitionIntensity: await calculateCompetitionIntensityAI(googleData, brandName),
      seoDifficulty: await calculateSeoDifficultyAI(googleData)
    };

    const overallScore = (scores.domainStrength * 0.4) + (scores.competitionIntensity * 0.4) + (scores.seoDifficulty * 0.2);
    
    // Generate AI-powered recommendation and insights
    const aiRecommendation = await generateAIReportAndRecommendation({
      ...scores,
      overallScore: Math.round(overallScore)
    }, brandName);

    const finalResponse = {
      brandName,
      overallScore: Math.round(overallScore),
      recommendation: aiRecommendation,
      scores,
      detailedAnalysis: {
        domainAvailability: domainData.map(d => ({ domain: d.domain, isAvailable: d.available })),
        googleCompetition: { topResults: googleData.slice(0, 5) }
      },
      cached: false,
      analysisTime: new Date().toISOString()
    };
    
    await databaseService.cacheAnalysis(brandName, finalResponse);
    await databaseService.updateAnalytics('fresh_analysis_completed', brandName, { overallScore: finalResponse.overallScore });

    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error('Error in /api/analyze route:', error);
    await databaseService.updateAnalytics('analysis_error', brandName, { error: error.message });
    return NextResponse.json({ message: 'An error occurred during analysis.' }, { status: 500 });
  }
}
