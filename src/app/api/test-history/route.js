import { NextResponse } from 'next/server';
import { db } from '@/services/firebase';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    // Test reading from the history collection
    const historyRef = collection(db, `users/${userId}/history`);
    const snapshot = await getDocs(historyRef);
    
    const docs = [];
    snapshot.forEach(doc => {
      docs.push({
        id: doc.id,
        data: doc.data()
      });
    });

    return NextResponse.json({
      userId,
      collectionPath: `users/${userId}/history`,
      documentCount: docs.length,
      documents: docs
    });
  } catch (error) {
    console.error('Test history error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { userId } = await request.json();
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    // Test writing to the history collection
    const testDoc = doc(db, `users/${userId}/history`, 'test-analysis');
    await setDoc(testDoc, {
      brandName: 'testbrand',
      category: 'Technology',
      overallScore: 85,
      scores: { domainStrength: 90, competitionIntensity: 80, seoDifficulty: 85 },
      recommendation: 'Test recommendation',
      date: serverTimestamp(),
      cached: false,
      analysisTime: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Test analysis saved',
      path: `users/${userId}/history/test-analysis`
    });
  } catch (error) {
    console.error('Test save error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 