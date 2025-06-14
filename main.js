// main.js - Test script for DeepScanService v2.8

import DeepScanService from './src/services/deepscan.js';

// --- CONFIGURATION ---
// IMPORTANT: Set your OpenAI API key in environment variables
const myOpenaiApiKey = process.env.OPENAI_API_KEY;

if (!myOpenaiApiKey) {
  console.error('❌ ERROR: OPENAI_API_KEY environment variable is required');
  console.error('Please set your OpenAI API key in your environment variables');
  process.exit(1);
}

// The brand name you are researching
const myBrandName = 'Verito';

// --- TEST FUNCTIONS ---

/**
 * Tests the deep scan on a single competitor URL.
 */
async function testSingleScan() {
  const competitorUrl = 'https://joelchhetri.tech/'; // Change this to the URL you want to test
  console.log(`--- Starting Single Scan for: ${competitorUrl} ---`);

  const deepScanService = new DeepScanService(myOpenaiApiKey);
  const result = await deepScanService.performDeepScan(competitorUrl, myBrandName);

  if (result.success) {
    console.log('\n✅ SCAN COMPLETE');
    console.log('\n--- Analyzed Data ---');
    console.log(result.analyzedData);
    console.log('\n--- AI Analysis ---');
    console.log(result.analysis);
  } else {
    console.error('\n❌ SCAN FAILED');
    console.error('Error:', result.error);
  }
}

/**
 * Tests the deep scan on multiple competitor URLs.
 */
async function testMultiScan() {
  const competitorUrls = [
    'https://www.competitor-a.com',
    'https://www.competitor-b.com',
    'https://www.competitor-c.com',
  ];
  console.log(`--- Starting Multi-Competitor Scan ---`);

  const deepScanService = new DeepScanService(myOpenaiApiKey);
  const result = await deepScanService.performMultipleDeepScan(competitorUrls, myBrandName);

  if (result.success) {
    console.log('\n✅ MULTI-SCAN COMPLETE');
    console.log(`\n--- Found ${result.data.competitorsAnalyzed.length} Competitors ---`);
    
    // Log the technology stack for each competitor
    result.data.competitorsAnalyzed.forEach(comp => {
        console.log(`[${comp.url}] Tech Stack: ${comp.technologyStack.join(', ')}`);
    });

    console.log('\n--- AI Comparative Analysis ---');
    console.log(result.data.comparativeAnalysis);
  } else {
    console.error('\n❌ MULTI-SCAN FAILED');
    console.error('Error:', result.error);
  }
}


// --- EXECUTION ---
// Choose which test to run by uncommenting one of the lines below.

(async () => {
  await testSingleScan();
  // await testMultiScan();
})();
