import { NextResponse } from 'next/server';
import { Paddle, EventName } from '@paddle/paddle-node-sdk';
import admin from '@/lib/firebase-admin';

// Initialize Paddle SDK
const paddle = new Paddle(process.env.PADDLE_API_KEY);

// Define credit packs based on their Price IDs
const CREDIT_PACKS = {
  'pri_01jypnx15gmrp3csr9wtvrrykq': { // Starter Pack
    standardAnalyses: 25,
    deepScans: 10,
  },
  'pri_01jypm11t9pdaeqdeygkg132at': { // Pro Pack
    standardAnalyses: 75,
    deepScans: 35,
  },
};

export async function POST(req) {
  const signature = req.headers.get('paddle-signature') || '';
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET || '';

  try {
    // The SDK needs the raw request body for verification.
    // Next.js 13+ App Router streams requests, so we need to read it as a buffer.
    const rawRequestBody = await req.text();
    
    // Verify and parse the webhook event
    const event = paddle.webhooks.unmarshal(rawRequestBody, webhookSecret, signature);

    // Check if the event is a completed transaction
    if (event && event.eventType === EventName.TransactionCompleted) {
      console.log(`Received event: ${event.eventType}`);
      
      const userId = event.data.customData?.userId;
      const purchasedItems = event.data.items;

      if (!userId || !purchasedItems || purchasedItems.length === 0) {
        console.error('Webhook error: Missing userId or items from customData.');
        return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
      }

      // Assume only one item is purchased at a time, as per our setup
      const purchasedPriceId = purchasedItems[0].price.id;
      const pack = CREDIT_PACKS[purchasedPriceId];

      if (!pack) {
        console.error(`Webhook error: Could not find credit pack for priceId ${purchasedPriceId}`);
        return NextResponse.json({ error: 'Purchased pack not found' }, { status: 400 });
      }

      // Update user's credits in Firestore
      const userDocRef = admin.firestore().doc(`users/${userId}`);
      
      await admin.firestore().runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists) {
          throw new Error('User not found in Firestore.');
        }

        const currentCredits = userDoc.data().credits || { standardAnalyses: 0, deepScans: 0 };
        
        const newStandardAnalyses = (currentCredits.standardAnalyses || 0) + pack.standardAnalyses;
        const newDeepScans = (currentCredits.deepScans || 0) + pack.deepScans;

        transaction.update(userDocRef, {
          'credits.standardAnalyses': newStandardAnalyses,
          'credits.deepScans': newDeepScans,
        });
      });
      
      console.log(`Successfully added credits to user ${userId}.`);
    }

    // Acknowledge the webhook
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error processing Paddle webhook:', error);
    // Return a 400 so Paddle knows something went wrong and will retry.
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
} 