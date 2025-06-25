'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#212121] pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] to-[#764ba2]">
                CenterPage
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Empowering entrepreneurs with AI-powered brand name analysis and validation tools.
            </p>
          </div>

          <div className="space-y-12">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                CenterPage was built to solve a critical problem every entrepreneur faces: choosing the right brand name. 
                We provide instant, AI-powered analysis on brand names, checking everything from domain availability and social media handles to potential trademark conflicts and competitor overlap. Our goal is to give you the confidence to build a strong, unique, and legally sound brand from day one.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">What Makes Us Different</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#667eea] mb-2">AI-Powered Analysis</h3>
                  <p className="text-gray-300 text-sm">
                    Our advanced AI doesn&apos;t just check domain availability,it analyzes competition, 
                    SEO difficulty, and provides strategic recommendations tailored to your industry.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#667eea] mb-2">Category-Aware Insights</h3>
                  <p className="text-gray-300 text-sm">
                    Unlike generic tools, we provide industry-specific analysis across 10 business 
                    categories, ensuring relevant and actionable insights.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#667eea] mb-2">Deep Competitive Intelligence</h3>
                  <p className="text-gray-300 text-sm">
                    Our deep scan feature scrapes competitor websites and generates comprehensive 
                    strategic analysis to help you understand the competitive landscape.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#667eea] mb-2">Founder-Focused</h3>
                  <p className="text-gray-300 text-sm">
                    Built by entrepreneurs, for entrepreneurs. We understand the challenges of 
                    building a brand and provide tools that actually help you make decisions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Get Started Today</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Ready to validate your brand name with confidence? Start with our free analysis 
                and discover insights that could save you months of rebranding later.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:from-[#5a6fd6] hover:to-[#6a3f9e] transition-all duration-200 font-semibold"
                >
                  Try Free Analysis
                </Link>
                <Link 
                  href="/#pricing" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 font-semibold border border-white/20"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
