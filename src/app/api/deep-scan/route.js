// src/app/api/deep-scan/route.js
import { NextResponse } from 'next/server';
import DeepScanService from '@/services/deepscan';
import databaseService from '@/services/database';
import { getGoogleResults } from '@/services/apiHelpers';


const deepScanService = new DeepScanService();


export async function POST(request) {
  try {
    const { brandName } = await request.json();
    
    if (!brandName) {
      return NextResponse.json({ message: 'Missing required parameter: brandName' }, { status: 400 });
    }

    await databaseService.updateAnalytics('deep_scan_started', brandName);
    
    const googleResults = await getGoogleResults(brandName);
    const competitorUrls = googleResults.slice(0, 5).map(result => result.link);
    
    if (competitorUrls.length === 0) {
      return NextResponse.json({ success: false, message: 'No competitors found for analysis' }, { status: 404 });
    }

    const result = await deepScanService.performMultipleDeepScan(competitorUrls, brandName);

    if (result.success) {
      await databaseService.updateAnalytics('deep_scan_completed', brandName, { competitorsAnalyzed: result.data.competitors?.length || 0 });
      return NextResponse.json({ success: true, data: result.data });
    } else {
      await databaseService.updateAnalytics('deep_scan_failed', brandName, { error: result.error });
      return NextResponse.json({ success: false, error: result.error || 'Deep scan failed' }, { status: 500 });
    }

  } catch (error) {
    console.error('Deep Scan endpoint error:', error);
    await databaseService.updateAnalytics('deep_scan_error', 'unknown', { error: error.message });
    return NextResponse.json({ success: false, message: 'An error occurred during deep scan analysis' }, { status: 500 });
  }
}
