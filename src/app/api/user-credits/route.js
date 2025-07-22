import { NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase-admin';
import admin from '@/lib/firebase-admin';

const db = admin.firestore();

export async function GET(request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  const decodedToken = await verifyIdToken(token);
  if (!decodedToken) {
    return NextResponse.json({ message: 'Invalid authentication token' }, { status: 401 });
  }

  const userId = decodedToken.uid;

  try {
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    
    if (!userDoc.exists) {
      // Create user document with default credits for new users
      console.log(`Creating user document for new user: ${userId}`);
      const defaultCredits = { standardAnalyses: 3, deepScans: 0 };
      
      await userDocRef.set({
        uid: userId,
        email: decodedToken.email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        credits: defaultCredits
      });
      
      return NextResponse.json(defaultCredits);
    }
    
    const credits = userDoc.data().credits || { standardAnalyses: 3, deepScans: 0 };
    
    return NextResponse.json({
      standardAnalyses: credits.standardAnalyses || 0,
      deepScans: credits.deepScans || 0
    });
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json({ message: 'Failed to fetch user credits' }, { status: 500 });
  }
} 