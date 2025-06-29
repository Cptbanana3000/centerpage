import admin from './firebase-admin';

const firestore = admin.firestore();
const rateLimitsCollection = firestore.collection('rateLimits');

/**
 * Checks if a request from a given identifier is allowed.
 * @param {string} identifier - A unique identifier for the user (e.g., IP address).
 * @param {number} limitSeconds - The cool-down period in seconds.
 * @returns {Promise<{success: boolean, message: string}>} - Whether the request is allowed.
 */
export async function checkFirebaseRateLimit(identifier, limitSeconds) {
  // Use a valid document ID by replacing characters that are not allowed.
  const docId = identifier.replace(/[^a-zA-Z0-9-_\.]/g, '_');
  const docRef = rateLimitsCollection.doc(docId);
  const now = new Date();

  try {
    const doc = await docRef.get();

    if (doc.exists) {
      const lastRequestTime = doc.data().timestamp.toDate();
      const secondsSinceLastRequest = (now.getTime() - lastRequestTime.getTime()) / 1000;

      if (secondsSinceLastRequest < limitSeconds) {
        // Not enough time has passed.
        return { success: false, message: `Rate limit exceeded. Try again in ${Math.ceil(limitSeconds - secondsSinceLastRequest)} seconds.` };
      }
    }

    // If we are here, the request is allowed. Update the timestamp.
    await docRef.set({ timestamp: now });
    return { success: true, message: 'Request allowed.' };

  } catch (error) {
    console.error("Firebase Rate Limit check failed:", error);
    // Fail open: If the rate limiter itself has an error, let the request through
    // so we don't block legitimate users. We can change this behavior if needed.
    return { success: true, message: 'Rate limiter check failed, allowing request.' };
  }
} 