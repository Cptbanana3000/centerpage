import { NextResponse } from 'next/server';
import { db } from '@/services/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// GET - Fetch user's analysis history
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Query user's analysis history from Firestore
    const historyRef = collection(db, 'analysisHistory');
    const q = query(
      historyRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const history = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      history.push({
        id: doc.id,
        brandName: data.brandName,
        category: data.category,
        overallScore: data.overallScore,
        date: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        scores: data.scores,
        recommendation: data.recommendation
      });
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    return NextResponse.json({ error: 'Failed to fetch analysis history' }, { status: 500 });
  }
}

// POST - Save new analysis to history
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, brandName, category, overallScore, scores, recommendation } = body;

    if (!userId || !brandName || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save analysis to Firestore
    const historyRef = collection(db, 'analysisHistory');
    const docRef = await addDoc(historyRef, {
      userId,
      brandName: brandName.toLowerCase(),
      category,
      overallScore: overallScore || 0,
      scores: scores || {},
      recommendation: recommendation || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      message: 'Analysis saved to history' 
    });
  } catch (error) {
    console.error('Error saving analysis to history:', error);
    return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });
  }
} 