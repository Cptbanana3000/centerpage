// src/services/apiHelpers.js
import axios from 'axios';


const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_CX = process.env.GOOGLE_SEARCH_CX;
import { WhoisJson } from '@whoisjson/whoisjson';


// Initialize the client with your new API key
const whois = new WhoisJson({
  apiKey: process.env.WHOISJSON_API_KEY 
});

/**
 * Checks the availability of multiple domains using the WhoisJSON API.
 * @param {string[]} domains - An array of domain names to check.
 * @returns {Promise<object[]>} - A promise that resolves to an array of availability results.
 */
export async function getDomainAvailability(domains) {
  const results = [];
  for (const domain of domains) {
    try {
      const availabilityInfo = await whois.checkDomainAvailability(domain);
      results.push(availabilityInfo);
    } catch (error) {
      console.error(`Failed to check domain ${domain}:`, error.message);
      results.push({ domain, available: false, error: true, message: error.message });
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