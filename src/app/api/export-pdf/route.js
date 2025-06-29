import { NextResponse } from 'next/server';
import { checkFirebaseRateLimit } from '@/lib/rate-limiter-firebase';
import { verifyIdToken } from '@/lib/firebase-admin';
import databaseService from '@/services/database';
import axios from 'axios';

export async function POST(request) {
  // --- RATE LIMIT CHECK (Firebase) ---
  const ip = request.ip ?? '127.0.0.1';
  const { success, message } = await checkFirebaseRateLimit(`exportpdf_ip_${ip}`, 30);
  if (!success) {
    return NextResponse.json({ message }, { status: 429 });
  }
  // --- END RATE LIMIT CHECK ---

  // 1. Authenticate and check credits
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  const decodedToken = await verifyIdToken(token);
  if (!decodedToken || !decodedToken.email_verified) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
  }
  const userId = decodedToken.uid;
  const hasCredits = await databaseService.checkAndDeductCredits(userId, 'deepScans');
  if (!hasCredits) {
    return NextResponse.json({ message: 'Insufficient credits for PDF export.' }, { status: 402 });
  }

  try {
    const body = await request.json();
    
    // 2. NEW: Call the external PDF service, expecting a file back
    const pdfResponse = await axios.post(
      `${process.env.EXTERNAL_BACKEND_URL}/export-pdf`,
      body,
      { 
        headers: { 'x-api-key': process.env.EXTERNAL_BACKEND_API_KEY },
        responseType: 'arraybuffer' // This is critical!
      }
    );
    
    // 3. Forward the PDF file from the backend directly to the user's browser
    return new NextResponse(pdfResponse.data, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': pdfResponse.headers['content-disposition'],
      },
    });

  } catch (error) {
    // 4. Refund credit on failure
    await databaseService.refundCredit(userId, 'deepScans');
    console.error("PROXY ERROR to /export-pdf:", error.response?.data || error.message);
    return NextResponse.json({ message: 'PDF export failed. Your credit has been refunded.' }, { status: 500 });
  }
}
