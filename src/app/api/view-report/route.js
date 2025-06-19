import { NextResponse } from 'next/server';
import databaseService from '@/services/database';
import { verifyIdToken } from '@/lib/firebase-admin';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const brandName = searchParams.get('brandName')?.trim();
  const category = searchParams.get('category') || 'general';

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

  const userId = decodedToken.uid;

  try {
    // Create cache key using same normalization as analyze route
    const normalizedBrandName = brandName.toLowerCase().trim();
    const cacheKey = `${normalizedBrandName}_${category.toLowerCase().replace(/\s+/g, '_')}`;
    
    // Try to get from user's history first
    const userHistory = await databaseService.getUserAnalysisHistory(userId);
    const savedReport = userHistory.find(item => item.id === cacheKey);
    
    if (savedReport) {
      // Return the saved report with a flag indicating it's from history
      return NextResponse.json({
        ...savedReport,
        cached: true,
        source: 'user_history'
      });
    }
    
    // Fallback: try to get from global cache (for edge cases)
    const cachedResult = await databaseService.getCachedAnalysis(cacheKey);
    if (cachedResult) {
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        source: 'global_cache'
      });
    }
    
    // If no saved report exists, return 404
    return NextResponse.json({
      message: 'No saved report found for this brand and category',
      code: 'REPORT_NOT_FOUND'
    }, { status: 404 });

  } catch (error) {
    console.error(`[View Report Error] for user ${userId}:`, error);
    return NextResponse.json(
      { message: 'An error occurred while retrieving the report', error: error.message },
      { status: 500 }
    );
  }
} 