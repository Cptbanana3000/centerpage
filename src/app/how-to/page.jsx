import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function HowToPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">How to Use CenterPage</h1>
          <p className="text-lg text-gray-600 mb-10">
            Welcome to CenterPage! Our platform is designed to take you from an initial idea to a validated brand name with a clear strategic advantage. Here’s how to get the most out of our tools.
          </p>

          <div className="space-y-12">
            {/* Step 1 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Step 1: Enter Your Brand Name and Category</h2>
              <p className="text-gray-700 mb-2">
                On the homepage, enter the brand name, product name, or startup idea you want to validate. Then, select the industry category from the dropdown menu that best fits your project.
              </p>
              <p className="text-gray-700 italic">
                <strong>Why is the category important?</strong> Our AI tailors its analysis based on the industry, giving you much more relevant insights into the competitive landscape and SEO viability.
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Step 2: Review Your Standard Analysis Report</h2>
              <p className="text-gray-700">
                After clicking 'Search', you will be taken to your comprehensive analysis dashboard. This initial report, which consumes one Standard Analysis Credit, gives you the complete picture of your brand's viability. You will see:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                <li><span className="font-semibold">Overall Viability Score:</span> A single, clear score from 0-100 that tells you how strong your brand name is at a glance.</li>
                <li><span className="font-semibold">AI Strategic Summary:</span> An AI-generated verdict and summary that explains the score and gives you a top-level recommendation.</li>
                <li><span className="font-semibold">Brand Metrics:</span> Detailed scores for Domain Strength, Competition Intensity, and SEO Difficulty.</li>
                <li><span className="font-semibold">Domain Availability:</span> A list of key domain TLDs (.com, .io, etc.) and whether they are available or taken.</li>
                <li><span className="font-semibold">Google Competitors:</span> A list of the top current results on Google for your brand name, giving you a clear view of your immediate competition.</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Step 3: Perform a Deep Scan for a Strategic Edge</h2>
              <p className="text-gray-700 mb-2">
                For the most promising brand names, you can go deeper. Click the "Perform Deep Scan" button on your analysis page. This will open a modal where you can select the most relevant competitors to analyze further.
              </p>
              <p className="text-gray-700">
                This advanced feature uses one Deep Scan Credit and provides a "Strategic Battle Plan," including an in-depth AI analysis of your competitors' strengths, weaknesses, and the technology they use.
              </p>
            </div>

            {/* Step 4 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Step 4: Managing Your Account & Credits</h2>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                <li><span className="font-semibold">Free Credits:</span> Every new account comes with 5 free Standard Analyses credits to help you get started.</li>
                <li><span className="font-semibold">Checking Your Balance:</span> You can see your current credit balance at any time on your dashboard.</li>
                <li><span className="font-semibold">Getting More Credits:</span> If you run out, you can purchase more one-time credit packs from the pricing section on the homepage.</li>
              </ul>
            </div>

            {/* Step 5 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Step 5: Export and Save Your Results</h2>
              <p className="text-gray-700">
                After a Deep Scan is complete, you can use one Deep Scan Credit to export your full, professional analysis as a PDF. This is perfect for sharing with your team, investors, or for your own records.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
