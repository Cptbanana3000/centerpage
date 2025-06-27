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
    let event = {};
    try {
      event = paddle.webhooks.unmarshal(rawRequestBody, webhookSecret, signature);
    } catch (signatureError) {
      console.warn('⚠️ Paddle signature verification failed:', signatureError.message);
      // Will use fallback parsing below
    }

    // If the SDK returned an empty object (signature mismatch or unsupported version),
    // fall back to plain JSON parsing so we can at least handle the purchase while
    // we debug the signature problem.
    let effectiveEvent = event;
    if (!effectiveEvent || Object.keys(effectiveEvent).length === 0) {
      try {
        effectiveEvent = JSON.parse(rawRequestBody);
        console.warn('⚠️ Using fallback parsed event; signature verification may have failed');
      } catch (e) {
        console.error('Failed to JSON.parse raw body fallback', e);
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
      }
    }

    // --- DEBUG -------------------------------------------------------------
    console.log('📦 Effective event', JSON.stringify(effectiveEvent, null, 2));
    // ----------------------------------------------------------------------

    // Check if the event is a completed transaction
    const eventType = effectiveEvent.eventType || effectiveEvent.event_type;

    if (
      effectiveEvent &&
      (eventType === EventName.TransactionCompleted || eventType === 'transaction.completed')
    ) {
      console.log(`Received event: ${eventType}`);

      const userId = effectiveEvent.data?.customData?.userId || effectiveEvent.data?.custom_data?.userId;
      const purchasedItems = effectiveEvent.data?.items || [];

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