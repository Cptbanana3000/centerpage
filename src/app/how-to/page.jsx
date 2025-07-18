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
            Welcome to CenterPage! Our tool is designed to be straightforward and  give you a comprehensive analysis of your brand name, helping you understand its strength and positioning in the market. Here’s a step-by-step guide to get you started.
          </p>

          <div className="space-y-12">
            {/* Step 1 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Step 1: Enter Your Brand Name</h2>
              <p className="text-gray-700">
                Start by typing your brand name, product name, or startup idea into the main search box on the homepage. This is the name we will analyze.
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Step 2: Select Your Industry Category</h2>
              <p className="text-gray-700">
                Next, choose the category that best represents your brand's industry from the dropdown menu. Selecting the right category is crucial as it helps our AI provide a more accurate and relevant analysis of your competitors and market landscape.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Step 3: Review Your Initial Analysis</h2>
              <p className="text-gray-700">
                After clicking 'Search', you'll be taken to the results page. Here, you'll see an initial analysis that includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                <li><span className="font-semibold">Domain & Social Handle Availability:</span> Check if the name is available as a .com domain and on major social media platforms.</li>
                <li><span className="font-semibold">Initial Competitor Scan:</span> A quick look at potential direct and indirect competitors based on a preliminary search.</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Step 4: Go Deeper with the Deep Scan</h2>
              <p className="text-gray-700">
                For a more thorough analysis, click the 'Start Deep Scan' button. This advanced feature uses one <span className="font-semibold">Deep Scan Credit</span> and takes a few minutes to complete. It provides a much more detailed report, including a larger set of competitors, their threat levels, and the reasoning behind their categorization.
              </p>
            </div>

            {/* Step 5: Managing Credits */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Step 5: Managing Your Account & Credits</h2>
              <p className="text-gray-700">
                Every new account comes with a few free Deep Scan Credits to get you started. You can check your current credit balance at any time in the top right corner of your dashboard.
              </p>
              <p className="text-gray-700 mt-2">
                If you run out, you can purchase more from the pricing section in the home page. You can also get there quickly by clicking the <span className="font-semibold">plus icon (+)</span> next to your credit balance on the dashboard.
              </p>
            </div>

            {/* Step 6 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Step 6: Export and Save Your Results</h2>
              <p className="text-gray-700">
                Once the deep scan is complete, you can export your full analysis as a PDF. This is perfect for sharing with your team, investors, or for keeping a record of your brand research.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
