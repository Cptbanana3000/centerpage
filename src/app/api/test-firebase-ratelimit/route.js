import { NextResponse } from 'next/server';
import { checkFirebaseRateLimit } from '@/lib/rate-limiter-firebase';

export async function GET(request) {
  const ip = request.ip ?? '127.0.0.1';

  // We'll test with a 10-second limit
  const { success, message } = await checkFirebaseRateLimit(`test_ip_${ip}`, 10);

  if (!success) {
    console.log(`RATE LIMIT EXCEEDED: ${message}`);
    return new NextResponse(message, { status: 429 });
  }

  console.log("Request successful.");
  return new NextResponse("Request successful!", { status: 200 });
} 