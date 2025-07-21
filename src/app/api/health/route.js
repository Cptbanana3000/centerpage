import { NextResponse } from 'next/server';

export async function GET() {
  const envStatus = {
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    GOOGLE_SEARCH_API_KEY: !!process.env.GOOGLE_SEARCH_API_KEY,
    GOOGLE_SEARCH_CX: !!process.env.GOOGLE_SEARCH_CX,
    GODADDY_API_KEY: !!process.env.GODADDY_API_KEY,
    GODADDY_API_SECRET: !!process.env.GODADDY_API_SECRET,
    GODADDY_ENV: !!process.env.GODADDY_ENV,
    PADDLE_API_KEY: !!process.env.PADDLE_API_KEY,
    PADDLE_WEBHOOK_SECRET: !!process.env.PADDLE_WEBHOOK_SECRET,
    FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY: !!process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
    EXTERNAL_BACKEND_URL: !!process.env.EXTERNAL_BACKEND_URL,
    EXTERNAL_BACKEND_API_KEY: !!process.env.EXTERNAL_BACKEND_API_KEY,
  };

  const allPresent = Object.values(envStatus).every(Boolean);

  return NextResponse.json({
    status: allPresent ? 'healthy' : 'missing_env_vars',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    environmentVariables: envStatus
  });
} 