import { NextResponse } from 'next/server';
import databaseService from '@/services/database';
import { verifyIdToken } from '@/lib/firebase-admin';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const brandName = searchParams.get('brandName');
  const category = searchParams.get('category');

  if (!brandName || !category) {
    return NextResponse.json({ message: 'brandName and category are required' }, { status: 400 });
  }

  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }
  const decoded = await verifyIdToken(token);
  if (!decoded) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const report = await databaseService.getDeepScanReport(brandName, category);
  if (!report) {
    return NextResponse.json({ message: 'Report not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: report });
} 