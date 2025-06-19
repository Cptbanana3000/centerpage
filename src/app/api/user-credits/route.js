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
      console.error(`User document not found for uid: ${userId}`);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    const credits = userDoc.data().credits || {};
    
    return NextResponse.json({
      standardAnalyses: credits.standardAnalyses || 0,
      deepScans: credits.deepScans || 0
    });
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json({ message: 'Failed to fetch user credits' }, { status: 500 });
  }
} 