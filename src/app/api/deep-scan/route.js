import { NextResponse } from 'next/server';
import { checkFirebaseRateLimit } from '@/lib/rate-limiter-firebase';
import databaseService from '@/services/database';
import { verifyIdToken } from '@/lib/firebase-admin';
import axios from 'axios';

export async function POST(request) {
  let decodedToken; // <-- FIX: Declare decodedToken here!

  try {
    // 1. Authenticate the user and check credits
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    decodedToken = await verifyIdToken(token); // Assign the value here
    if (!decodedToken || !decodedToken.email_verified) {
      return NextResponse.json({ message: 'Invalid or unverified token' }, { status: 403 });
    }

    const userId = decodedToken.uid;

    // --- RATE LIMIT CHECK (Firebase) - USER-BASED ---
    const { success, message } = await checkFirebaseRateLimit(`deepscan_user_${userId}`, 30);
    if (!success) {
      return NextResponse.json({ message }, { status: 429 });
    }
    // --- END RATE LIMIT CHECK ---
    const hasCredits = await databaseService.checkAndDeductCredits(userId, 'deepScans');
    if (!hasCredits) {
      return NextResponse.json({ message: 'Insufficient Deep Scan credits.' }, { status: 402 });
    }

    const body = await request.json();
    
    console.log('🔍 Attempting to call backend at:', `${process.env.EXTERNAL_BACKEND_URL}/deep-scan`);
    
    // 1. Call the backend to *start* the job.
    const backendResponse = await axios.post(
      `${process.env.EXTERNAL_BACKEND_URL}/api/deep-scan`,
      body,
      { headers: { 'x-api-key': process.env.EXTERNAL_BACKEND_API_KEY } }
    );

    // 2. Check for a successful job initiation.
    if (backendResponse.status === 202 && backendResponse.data.jobId) {
      // 3. Save the jobId and scan parameters to user history
      await databaseService.saveDeepScanToHistory(userId, backendResponse.data.jobId, body);
      
      // 4. Return the jobId to the frontend with a 202 "Accepted" status.
      return NextResponse.json({ jobId: backendResponse.data.jobId }, { status: 202 });
    } else {
      // If the backend didn't accept the job, something is wrong.
      throw new Error(backendResponse.data.message || 'Failed to start analysis job on the backend.');
    }

  } catch (error) {
    // If anything fails during the *initiation*, refund the user's credit.
    if (decodedToken?.uid) {
      await databaseService.refundCredit(decodedToken.uid, 'deepScans');
    }
    
    console.error("🚨 DEEP SCAN ERROR:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    
    return NextResponse.json({ 
      success: false, 
      error: 'Deep scan failed to start. Your credit has been refunded.',
      details: error.message 
    }, { status: 500 });
  }
}