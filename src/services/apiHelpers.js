// src/services/apiHelpers.js
import axios from 'axios';

const GODADDY_API_KEY = process.env.GODADDY_API_KEY;
const GODADDY_API_SECRET = process.env.GODADDY_API_SECRET;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_CX = process.env.GOOGLE_SEARCH_CX;
const GODADDY_BASE_URL = process.env.GODADDY_ENV === 'PRODUCTION' ? 'https://api.godaddy.com' : 'https://api.ote-godaddy.com';

// This function is correct and remains unchanged.
export async function getDomainAvailability(domains) {
  const results = [];
  for (const domain of domains) {
    try {
            const url = `${GODADDY_BASE_URL}/v1/domains/available?domain=${domain}`;
      console.log(`[GoDaddy API] Checking domain: ${domain}`);
      console.log(`[GoDaddy API] Request URL: ${url}`);
      console.log(`[GoDaddy API] Using Key: ${GODADDY_API_KEY ? GODADDY_API_KEY.substring(0, 5) + '...' : 'Not Found'}`);
      const response = await axios.get(url, { headers: { 'Authorization': `sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}` } });
      results.push(response.data);
    } catch (error) {
      console.error(`Failed to check domain ${domain}:`, error.response?.data || error.message);
      results.push({ domain, available: false, error: true });
    }
  }
  return results;
}

/**
 * FIXED: Performs a Google search with optional exact phrase matching.
 * @param {string} keyword - The search term.
 * @param {boolean} [exactMatch=false] - Whether to wrap the keyword in quotes for an exact search.
 * @returns {Promise<Array>} - An array of search results.
 */
export async function getGoogleResults(keyword, exactMatch = false) {
    if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_CX) return [];
    
    // Conditionally wrap the keyword in quotes for an exact phrase search
    const searchQuery = exactMatch ? `"${keyword}"` : keyword;
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_CX}&q=${encodeURIComponent(searchQuery)}`;
    
    try {
        const response = await axios.get(url);
        // Ensure we always return an array
        return response.data.items || [];
    } catch(error) {
        console.error(`Google API Error for keyword "${keyword}":`, error.response?.data?.error?.message || error.message);
        return [];
    }
}
