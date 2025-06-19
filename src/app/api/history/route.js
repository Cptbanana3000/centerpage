import { NextResponse } from 'next/server';
import { db } from '@/services/firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';

// GET - Fetch user's analysis history
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Query user's analysis history from the correct subcollection path
    const historyRef = collection(db, `users/${userId}/history`);
    const q = query(
      historyRef,
      orderBy('date', 'desc'),
      limit(50)
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
        date: data.date?.toDate?.()?.toISOString() || data.analysisTime || new Date().toISOString(),
        scores: data.scores,
        recommendation: data.recommendation
      });
    });

    console.log(`Fetched ${history.length} analysis records for user ${userId}`);
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    return NextResponse.json({ error: 'Failed to fetch analysis history' }, { status: 500 });
  }
} 