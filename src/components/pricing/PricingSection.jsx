'use client';

import { Button } from '@/components/ui/button';
import { SignUpDialog } from '@/components/auth/SignUpDialog';

export function PricingSection() {
  return (
    <>
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.3;
          z-index: 0;
        }

        .blob-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(45deg, #6366f1, #ec4899);
          top: 10%;
          left: -10%;
          animation: float 6s ease-in-out infinite;
        }

        .blob-2 {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #14b8a6, #8b5cf6);
          bottom: 20%;
          right: -5%;
          animation: float 8s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        /* Mobile First Media Queries */
        @media (max-width: 640px) {
          .glass-card {
            backdrop-filter: blur(8px);
          }
          
          .blob-1 {
            width: 200px;
            height: 200px;
            top: 5%;
            left: -20%;
          }
          
          .blob-2 {
            width: 180px;
            height: 180px;
            bottom: 10%;
            right: -15%;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .glass-card {
            backdrop-filter: blur(10px);
          }
          
          .blob-1 {
            width: 250px;
            height: 250px;
            top: 8%;
            left: -15%;
          }
          
          .blob-2 {
            width: 220px;
            height: 220px;
            bottom: 15%;
            right: -10%;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .glass-card {
            backdrop-filter: blur(12px);
          }
          
          .blob-1 {
            width: 280px;
            height: 280px;
          }
          
          .blob-2 {
            width: 240px;
            height: 240px;
          }
        }

        @media (min-width: 1025px) {
          .glass-card {
            backdrop-filter: blur(15px);
          }
          
          .blob-1 {
            width: 350px;
            height: 350px;
          }
          
          .blob-2 {
            width: 300px;
            height: 300px;
          }
        }

        /* Hover effects - disabled on touch devices */
        @media (hover: hover) {
          .glass-card:hover {
            transform: scale(1.05);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .glass-card {
            backdrop-filter: blur(12px);
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .blob-1, .blob-2 {
            animation: none;
          }
          
          .glass-card {
            transition: none;
          }
          
          .glass-card:hover {
            transform: none;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: light) {
          .glass-card {
            background: rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(0, 0, 0, 0.1);
          }
        }

        /* Print styles */
        @media print {
          .blob-1, .blob-2 {
            display: none;
          }
          
          .glass-card {
            background: white;
            border: 1px solid #ccc;
            backdrop-filter: none;
          }
        }
      `}</style>

      <section id="pricing" className="min-h-screen bg-[#212121] text-white py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        {/* Background decorative blobs */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Empowering Your Journey
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl lg:max-w-3xl mx-auto px-4">
              Our one-time packs align with your process. Explore freely, then get deep validation for your best ideas—no subscription needed.
            </p>
          </div>

          {/* Pricing Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {/* Tier 1: Explorer (Free Plan) */}
            <div className="glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-indigo-400 lg:hover:scale-105">
              <div className="flex-grow">
                <h3 className="text-xl sm:text-2xl font-bold text-indigo-300 mb-2">Explorer</h3>
                <p className="text-gray-400 text-sm sm:text-base h-10 sm:h-12 leading-tight">
                  Experience the core power of the tool, on us.
                </p>
                <div className="mt-4 sm:mt-6 mb-6 sm:mb-8">
                  <span className="text-4xl sm:text-5xl font-extrabold">$0</span>
                </div>
                <ul className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span><span className="font-semibold">5 Free Standard Analyses</span> (one-time)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Full <span className="font-semibold">Standard Report</span> Access</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Deep Scan AI Report (Locked)</span>
                  </li>
                </ul>
              </div>
              
              <Button className="mt-6 sm:mt-8 w-full bg-indigo-600 text-white font-bold py-2.5 sm:py-3 rounded-lg transition-all duration-300 hover:bg-indigo-500 cursor-pointer text-sm sm:text-base">
                Try it for free
              </Button>
            </div>

            {/* Tier 2: Starter Pack */}
            <div className="glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-teal-400 lg:hover:scale-105">
              <div className="flex-grow">
                <h3 className="text-xl sm:text-2xl font-bold text-teal-300 mb-2">Starter Pack</h3>
                <p className="text-gray-400 text-sm sm:text-base h-10 sm:h-12 leading-tight">
                  For a focused brainstorming session to find a great name.
                </p>
                <div className="mt-4 sm:mt-6 mb-6 sm:mb-8 flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-extrabold">$4.99</span>
                  <span className="text-gray-400 text-xl sm:text-2xl line-through ml-2">$7.99</span>
                </div>
                <ul className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span><span className="font-semibold">25</span> Standard Analyses</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span><span className="font-semibold">10</span> Deep Scan Reports</span>
                  </li>
                </ul>
              </div>
              <Button className="mt-6 sm:mt-8 w-full bg-teal-600 text-white font-bold py-2.5 sm:py-3 rounded-lg transition-all duration-300 hover:bg-teal-500 cursor-pointer text-sm sm:text-base">
                Buy Starter Pack
              </Button>
            </div>

            {/* Tier 3: Pro Pack - Highlighted */}
            <div className="glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col ring-2 ring-pink-500 shadow-2xl relative transition-all duration-300 lg:hover:scale-105 md:col-span-2 lg:col-span-1">
              <div className="absolute top-0 right-4 sm:right-8 -mt-3 sm:-mt-4 bg-pink-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 rounded-full">
                BEST VALUE
              </div>
              <div className="flex-grow">
                <h3 className="text-xl sm:text-2xl font-bold text-pink-300 mb-2">Pro Pack</h3>
                <p className="text-gray-400 text-sm sm:text-base h-10 sm:h-12 leading-tight">
                  For comprehensive research on one or more projects.
                </p>
                <div className="mt-4 sm:mt-6 mb-6 sm:mb-8 flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-extrabold">$9.99</span>
                  <span className="text-gray-400 text-xl sm:text-2xl line-through ml-2">$14.99</span>
                </div>
                <ul className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span><span className="font-semibold">75</span> Standard Analyses</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span><span className="font-semibold">35</span> Deep Scan Reports</span>
                  </li>
                </ul>
              </div>
              <Button className="mt-6 sm:mt-8 w-full bg-pink-500 text-white font-bold py-2.5 sm:py-3 rounded-lg transition-all duration-300 hover:bg-pink-400 cursor-pointer text-sm sm:text-base">
                Buy Pro Pack
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}