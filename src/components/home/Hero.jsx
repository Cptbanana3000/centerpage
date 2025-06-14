'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SignUpDialog } from '@/components/auth/SignUpDialog';

export function Hero() {
  const [brandName, setBrandName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleAnalysis = async () => {
    if (!brandName.trim()) {
      setError('Please enter a brand name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Navigate directly to analysis page with brand name
      router.push(`/analysis?brand=${encodeURIComponent(brandName.trim())}`);
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to start analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden min-h-screen pt-16 bg-[#212121]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '-3s' }}></div>
      </div>

      <div className="relative text-center max-w-4xl mx-auto px-4 py-16">
        <div className="animate-float">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Is your <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">brand name</span> truly viable?
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light">
            Get comprehensive analysis of domains, social handles, competition, and SEO viability.
          </p>
        </div>

        <div className="max-w-2xl mx-auto animate-float" style={{ animationDelay: '-1s' }}>
          <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl">
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalysis()}
              placeholder="e.g., 'veritolab' or 'flexwidgets'"
              className="w-full p-6 text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea] placeholder-gray-400 bg-white/5 text-white"
            />
            <button
              onClick={handleAnalysis}
              disabled={isLoading}
              className="text-white font-semibold py-6 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#667eea]/30 whitespace-nowrap flex items-center justify-center bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#5a6fd6] hover:to-[#6a3f9e] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-search mr-2"></i> Analyze
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 text-red-500 text-sm">{error}</div>
          )}
        </div>
      </div>
    </section>
  );
} 