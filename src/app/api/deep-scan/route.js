import { NextResponse } from 'next/server';
import { checkFirebaseRateLimit } from '@/lib/rate-limiter-firebase';
import databaseService from '@/services/database';
import { verifyIdToken } from '@/lib/firebase-admin';
import axios from 'axios';

export async function POST(request) {
  // --- RATE LIMIT CHECK (Firebase) ---
  const ip = request.ip ?? '127.0.0.1';
  const { success, message } = await checkFirebaseRateLimit(`deepscan_ip_${ip}`, 30);
  if (!success) {
    return NextResponse.json({ message }, { status: 429 });
  }
  // --- END RATE LIMIT CHECK ---

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
    
    // 1. Call the backend to *start* the job.
    const backendResponse = await axios.post(
      `${process.env.EXTERNAL_BACKEND_URL}/deep-scan`,
      body,
      { headers: { 'x-api-key': process.env.EXTERNAL_BACKEND_API_KEY } }
    );

    // 2. Check for a successful job initiation.
    if (backendResponse.status === 202 && backendResponse.data.jobId) {
      // 3. Immediately return the jobId to the frontend with a 202 "Accepted" status.
      return NextResponse.json({ jobId: backendResponse.data.jobId }, { status: 202 });
    } else {
      // If the backend didn't accept the job, something is wrong.
      throw new Error(backendResponse.data.message || 'Failed to start analysis job on the backend.');
    }

  } catch (error) {
    // If anything fails during the *initiation*, refund the user's credit.
    await databaseService.refundCredit(userId, 'deepScans');
    console.error("PROXY ERROR to /deep-scan:", error.response?.data || error.message);
    return NextResponse.json({ success: false, error: 'Deep scan failed to start. Your credit has been refunded.' }, { status: 500 });
  }
}
