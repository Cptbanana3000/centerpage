import { NextResponse } from 'next/server';
import { Paddle, EventName } from '@paddle/paddle-node-sdk';
import admin from '@/lib/firebase-admin';

// Initialize Paddle SDK
const paddle = new Paddle(process.env.PADDLE_API_KEY);

// Define credit packs based on their Price IDs
const CREDIT_PACKS = {
  'pri_01jypnx15gmrp3csr9wtvrrykq': { // Pro Pack ($49.99)
    standardAnalyses: 30,
    deepScans: 15,
  },
  'pri_01jypm11t9pdaeqdeygkg132at': { // Starter Pack ($19.99)
    standardAnalyses: 15,
    deepScans: 7,
  },
  'pri_01k04w0g2avm0xwk71hxyergcw': { // Basic Pack ($7.99)
    standardAnalyses: 15,
    deepScans: 0,
  },
};

export async function POST(req) {
  const signature = req.headers.get('paddle-signature') || '';
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET || '';

  // DEBUG: log signature & secret presence
  console.log('🖊  Header signature length', signature.length);
  console.log('🔑 Secret present', !!webhookSecret);

  try {
    // Get raw request body as ArrayBuffer, then convert to string
    // This preserves the exact bytes that Paddle signed
    const arrayBuffer = await req.arrayBuffer();
    const rawRequestBody = Buffer.from(arrayBuffer).toString();

    // --- DEBUG -------------------------------------------------------------
    console.log('🔔 Raw request body (first 300 chars):', rawRequestBody.slice(0, 300));
    // ----------------------------------------------------------------------
    
    // Verify and parse the webhook event
    let event = {};
    let signatureVerified = false;
    try {
      event = paddle.webhooks.unmarshal(rawRequestBody, webhookSecret, signature);
      console.log('✅ Signature verification successful');
      signatureVerified = true;
    } catch (signatureError) {
      console.warn('⚠️ Paddle signature verification failed:', signatureError.message);
      // Will use fallback parsing below
    }

    // If the SDK returned an empty object even after successful verification,
    // or if signature verification failed, fall back to plain JSON parsing
    let effectiveEvent = event;
    if (!effectiveEvent || Object.keys(effectiveEvent).length === 0) {
      try {
        effectiveEvent = JSON.parse(rawRequestBody);
        if (!signatureVerified) {
          console.warn('⚠️ Using fallback parsed event; signature verification failed');
        } else {
          console.warn('⚠️ Using fallback parsed event; SDK returned empty object despite successful verification');
        }
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