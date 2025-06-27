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

  // DEBUG: log signature & secret presence
  console.log('🖊  Header signature length', signature.length);
  console.log('🔑 Secret present', !!webhookSecret);

  try {
    // The SDK needs the raw request body for verification.
    // Next.js 13+ App Router streams requests, so we need to read it as a buffer.
    const rawRequestBody = await req.text();

    // --- DEBUG -------------------------------------------------------------
    console.log('🔔 Raw request body (first 300 chars):', rawRequestBody.slice(0, 300));
    // ----------------------------------------------------------------------
    
    // Verify and parse the webhook event
    const event = paddle.webhooks.unmarshal(rawRequestBody, webhookSecret, signature);

    // --- DEBUG -------------------------------------------------------------
    console.log('🔔 Unmarshalled event', JSON.stringify(event, null, 2));
    // ----------------------------------------------------------------------

    // Check if the event is a completed transaction
    if (
      event &&
      (event.eventType === EventName.TransactionCompleted || // enum value
       event.eventType === 'transaction.completed')           // raw string fallback
    ) {
      console.log(`Received event: ${event.eventType}`);

      const userId = event.data.customData?.userId;
      const purchasedItems = event.data.items;

      // --- DEBUG -----------------------------------------------------------
      console.log('🛠 userId', userId);
      console.log('🛠 purchasedItems', JSON.stringify(purchasedItems));
      // --------------------------------------------------------------------

      if (!userId || !purchasedItems || purchasedItems.length === 0) {
        console.error('Webhook error: Missing userId or items from customData.');
        return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
      }

      // Assume only one item is purchased at a time, as per our setup
      const purchasedPriceId = purchasedItems[0].price.id;
      const pack = CREDIT_PACKS[purchasedPriceId];

      // --- DEBUG -----------------------------------------------------------
      console.log('🛠 priceId', purchasedPriceId);
      console.log('🛠 matched pack', pack);
      // --------------------------------------------------------------------

      if (!pack) {
        console.error(`Webhook error: Could not find credit pack for priceId ${purchasedPriceId}`);
        return NextResponse.json({ error: 'Purchased pack not found' }, { status: 400 });
      }

      // Update user's credits in Firestore
      const userDocRef = admin.firestore().doc(`users/${userId}`);

      await admin.firestore().runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        let currentCredits = { standardAnalyses: 0, deepScans: 0 };

        if (userDoc.exists) {
          currentCredits = userDoc.data().credits || currentCredits;
        }

        const newStandardAnalyses = (currentCredits.standardAnalyses || 0) + pack.standardAnalyses;
        const newDeepScans = (currentCredits.deepScans || 0) + pack.deepScans;

        // If the doc doesn't exist yet, set it; otherwise update.
        transaction.set(
          userDocRef,
          {
            credits: {
              standardAnalyses: newStandardAnalyses,
              deepScans: newDeepScans,
            },
          },
          { merge: true }
        );
      });

      console.log(`✅ Successfully added credits to user ${userId}.`);
    }

    // Acknowledge the webhook
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error processing Paddle webhook:', error);
    // Return a 400 so Paddle knows something went wrong and will retry.
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
} 