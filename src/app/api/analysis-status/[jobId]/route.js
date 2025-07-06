import { NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase-admin';
import axios from 'axios';
import databaseService from '@/services/database';

export async function GET(request, { params }) {
  // 1. Authenticate the user. We don't want unauthorized users polling job statuses.
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  const decodedToken = await verifyIdToken(token);
  if (!decodedToken) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
  }

  // 2. Get the jobId from the dynamic URL parameter.
  const { jobId } = params;
  if (!jobId) {
    return NextResponse.json({ message: 'Job ID is required.' }, { status: 400 });
  }

  try {
    // 3. Proxy the status check to the backend service.
    const backendResponse = await axios.get(
      `${process.env.EXTERNAL_BACKEND_URL}/analysis-status/${jobId}`,
      { headers: { 'x-api-key': process.env.EXTERNAL_BACKEND_API_KEY } }
    );

    // 4. If the job is complete, save the final report to the database.
    if (backendResponse.data?.state === 'completed' && backendResponse.data?.result) {
      const { brandName, category, data } = backendResponse.data.result;
      if (brandName && category && data) {
         await databaseService.saveDeepScanReport(brandName, category, data);
      }
    }

    // 5. Return the entire response from the backend to our frontend.
    return NextResponse.json(backendResponse.data, { status: backendResponse.status });

  } catch (error) {
    console.error(`PROXY ERROR to /analysis-status/${jobId}:`, error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to get analysis status.';
    return NextResponse.json({ message }, { status });
  }
} 