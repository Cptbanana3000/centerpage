import { NextResponse } from 'next/server';
import databaseService from '@/services/database';
import { verifyIdToken } from '@/lib/firebase-admin';
import axios from 'axios';

export async function POST(request) {
  // 1. Authenticate the user and check credits (this logic stays here)
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

  const decodedToken = await verifyIdToken(token);
  if (!decodedToken || !decodedToken.email_verified) {
    return NextResponse.json({ message: 'Invalid or unverified token' }, { status: 403 });
  }

  const userId = decodedToken.uid;
  const hasCredits = await databaseService.checkAndDeductCredits(userId, 'deepScans');
  if (!hasCredits) {
    return NextResponse.json({ message: 'Insufficient Deep Scan credits.' }, { status: 402 });
  }

  try {
    const body = await request.json();
    
    // 2. THIS IS THE NEW PART: Proxy the request to your new backend
    const backendResponse = await axios.post(
      `${process.env.EXTERNAL_BACKEND_URL}/deep-scan`,
      body,
      { headers: { 'x-api-key': process.env.EXTERNAL_BACKEND_API_KEY } }
    );

    // 3. Handle the response from the backend
    if (backendResponse.data.success) {
      await databaseService.saveDeepScanReport(body.brandName, body.category, backendResponse.data.data);
      return NextResponse.json(backendResponse.data);
    } else {
      throw new Error(backendResponse.data.message || 'External service failed');
    }

  } catch (error) {
    // 4. If anything fails, refund the user's credit
    await databaseService.refundCredit(userId, 'deepScans');
    console.error("PROXY ERROR to /deep-scan:", error.response?.data || error.message);
    return NextResponse.json({ success: false, error: 'Deep scan failed. Your credit has been refunded.' }, { status: 500 });
  }
}
