'use client';

import { Button } from '@/components/ui/button';
import { SignUpDialog } from '@/components/auth/SignUpDialog';

export function PricingSection() {
  return (
    <section id="pricing" className="min-h-screen bg-[#212121] text-white py-32 relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Empowering Your Journey
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Our one-time packs align with your process. Explore freely, then get deep validation for your best ideas—no subscription needed.
          </p>
        </div>

        {/* Pricing Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Tier 1: Explorer (Free Plan) */}
          <div className="glass-card rounded-2xl p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-indigo-400 hover:scale-105">
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-indigo-300">Explorer</h3>
              <p className="text-gray-400 mt-2 h-12">Experience the core power of the tool, on us.</p>
              <div className="mt-6 mb-8">
                <span className="text-5xl font-extrabold">$0</span>
              </div>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><span className="font-semibold">5 Free Standard Analyses</span> (one-time)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Full <span className="font-semibold">Standard Report</span> Access</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-red-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  <span>Deep Scan AI Report (Locked)</span>
                </li>
              </ul>
            </div>
            <SignUpDialog>
              <Button className="mt-8 w-full bg-indigo-600 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:bg-indigo-500">
                Start Exploring
              </Button>
            </SignUpDialog>
          </div>

          {/* Tier 2: Starter Pack */}
          <div className="glass-card rounded-2xl p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-teal-400 hover:scale-105">
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-teal-300">Starter Pack</h3>
              <p className="text-gray-400 mt-2 h-12">For a focused brainstorming session to find a great name.</p>
              <div className="mt-6 mb-8 flex items-baseline">
                <span className="text-5xl font-extrabold">$3.99</span>
                <span className="text-gray-400 text-2xl line-through ml-2">$5.99</span>
              </div>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><span className="font-semibold">25</span> Standard Analyses</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><span className="font-semibold">10</span> Deep Scan Reports</span>
                </li>
              </ul>
            </div>
            <Button className="mt-8 w-full bg-teal-600 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:bg-teal-500">
              Buy Starter Pack
            </Button>
          </div>

          {/* Tier 3: Pro Pack - Highlighted */}
          <div className="glass-card rounded-2xl p-8 flex flex-col ring-2 ring-pink-500 shadow-2xl relative transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-8 -mt-4 bg-pink-500 text-white text-sm font-bold px-4 py-1 rounded-full">BEST VALUE</div>
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-pink-300">Pro Pack</h3>
              <p className="text-gray-400 mt-2 h-12">For comprehensive research on one or more projects.</p>
              <div className="mt-6 mb-8 flex items-baseline">
                <span className="text-5xl font-extrabold">$9.99</span>
                <span className="text-gray-400 text-2xl line-through ml-2">$14.99</span>
              </div>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><span className="font-semibold">100</span> Standard Analyses</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><span className="font-semibold">50</span> Deep Scan Reports</span>
                </li>
              </ul>
            </div>
            <Button className="mt-8 w-full bg-pink-500 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:bg-pink-400">
              Buy Pro Pack
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 