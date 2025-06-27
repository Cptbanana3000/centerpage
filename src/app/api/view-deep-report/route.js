import { NextResponse } from 'next/server';
import databaseService from '@/services/database';
import { verifyIdToken } from '@/lib/firebase-admin';

export async function GET(request) {
  console.log('view-deep-report endpoint called');
  
  const { searchParams } = new URL(request.url);
  const brandName = searchParams.get('brandName');
  const category = searchParams.get('category');

  console.log('Parameters:', { brandName, category });

  if (!brandName || !category) {
    console.log('Missing required parameters');
    return NextResponse.json({ message: 'brandName and category are required' }, { status: 400 });
  }

  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) {
    console.log('No authorization token provided');
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const decoded = await verifyIdToken(token);
    if (!decoded) {
      console.log('Token verification failed');
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    console.log('Fetching deep scan report from database...');
    const report = await databaseService.getDeepScanReport(brandName, category);
    
    if (!report) {
      console.log('Report not found in database');
      return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }

    console.log('Report found and returned successfully');
    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error('Error in view-deep-report:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 