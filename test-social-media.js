import { checkSocialMediaHandles } from './src/services/apiHelpers.js';

async function testSocialMediaHandles() {
  console.log('\n🔍 Testing Social Media Handle Checker\n');
  
  const testBrands = [
    'centerpage',
    'apple',
    'nonexistenthandle123'
  ];

  for (const brand of testBrands) {
    console.log(`\n=== Testing brand: ${brand} ===`);
    try {
      const results = await checkSocialMediaHandles(brand);
      console.log('\nResults:');
      results.forEach(result => {
        console.log(`\n${result.platform}:`);
        console.log(`  Handle: ${result.handle}`);
        console.log(`  URL: ${result.url}`);
        console.log(`  Available: ${result.available ? 'Yes' : 'No'}`);
        console.log(`  Check Type: ${result.checkType}`);
        console.log(`  Status: ${result.status}`);
        console.log(`  Message: ${result.message}`);
        if (result.error) {
          console.log(`  Error: ${result.error}`);
        }
      });
    } catch (error) {
      console.error(`Error testing ${brand}:`, error.message);
    }
  }
}

testSocialMediaHandles(); 