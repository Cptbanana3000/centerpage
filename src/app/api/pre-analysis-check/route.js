import { NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase-admin';
import admin from '@/lib/firebase-admin';

const db = admin.firestore();

async function checkUserCredits(userId) {
  if (!userId) return { hasStandardCredits: false, hasDeepCredits: false, credits: { standardAnalyses: 0, deepScans: 0 } };
  
  const userDocRef = db.collection('users').doc(userId);
  
  try {
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      console.error(`Pre-check: User document not found for uid: ${userId}`);
      return { hasStandardCredits: false, hasDeepCredits: false, credits: { standardAnalyses: 0, deepScans: 0 } };
    }
    
    const credits = userDoc.data().credits || {};
    const standardAnalyses = credits.standardAnalyses || 0;
    const deepScans = credits.deepScans || 0;
    
    return { 
      hasStandardCredits: standardAnalyses > 0,
      hasDeepCredits: deepScans > 0,
      credits: { standardAnalyses, deepScans }
    };
  } catch (error) {
    console.error('Error checking credits in pre-analysis-check:', error);
    return { hasStandardCredits: false, hasDeepCredits: false, credits: { standardAnalyses: 0, deepScans: 0 } };
  }
}

export async function POST(request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    // This case is for non-logged-in users.
    // They are treated as having no credits and being unverified.
    // The UI can then decide to prompt them to log in.
    return NextResponse.json({ 
      isAuthenticated: false,
      isVerified: false, 
      hasStandardCredits: false,
      hasDeepCredits: false,
      credits: { standardAnalyses: 0, deepScans: 0 }
    });
  }

  const decodedToken = await verifyIdToken(token);
  if (!decodedToken) {
    return NextResponse.json({ message: 'Invalid authentication token' }, { status: 401 });
  }

  const { uid, email_verified } = decodedToken;
  
  if (!email_verified) {
    return NextResponse.json({ 
      isAuthenticated: true,
      isVerified: false, 
      hasStandardCredits: false,
      hasDeepCredits: false,
      credits: { standardAnalyses: 0, deepScans: 0 }
    });
  }

  const { hasStandardCredits, hasDeepCredits, credits } = await checkUserCredits(uid);

  if (!hasStandardCredits) {
    return NextResponse.json({ 
      isAuthenticated: true,
      isVerified: true, 
      hasStandardCredits: false,
      hasDeepCredits,
      credits
    });
  }

  // If all checks pass:
  return NextResponse.json({ 
    isAuthenticated: true,
    isVerified: true, 
    hasStandardCredits: true,
    hasDeepCredits,
    credits
  });
} 