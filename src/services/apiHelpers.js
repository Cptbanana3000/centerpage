// src/services/apiHelpers.js
import axios from 'axios';

const GODADDY_API_KEY = process.env.GODADDY_API_KEY;
const GODADDY_API_SECRET = process.env.GODADDY_API_SECRET;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_CX = process.env.GOOGLE_SEARCH_CX;
const GODADDY_BASE_URL = process.env.GODADDY_ENV === 'PRODUCTION' ? 'https://api.godaddy.com' : 'https://api.ote-godaddy.com';

// This function is copied directly from your server.js
export async function getDomainAvailability(domains) {
  const results = [];
  for (const domain of domains) {
    try {
      const url = `${GODADDY_BASE_URL}/v1/domains/available?domain=${domain}`;
      const response = await axios.get(url, { headers: { 'Authorization': `sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}` } });
      results.push(response.data);
    } catch (error) {
      console.error(`Failed to check domain ${domain}:`, error.response?.data || error.message);
      results.push({ domain, available: false, error: true });
    }
  }
  return results;
}

// This function is copied directly from your server.js
export async function getGoogleResults(keyword) {
    if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_CX) return [];
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_CX}&q="${keyword}"`;
    try {
        const response = await axios.get(url);
        return response.data.items || [];
    } catch(error) {
        console.error('Google API Error:', error.response?.data?.error?.message || error.message);
        return [];
    }
}
