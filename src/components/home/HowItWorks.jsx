'use client';

import Image from 'next/image';

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Enter Your Brand",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      description: "Enter your brand name and industry. Our engine instantly checks domain availability and runs AI-powered analyses on Google search results."
    },
    {
      number: "02",
      title: "Get Actionable Insights",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: "Receive a clear, data-driven dashboard with scores for Domain Strength, Competition Intensity, and SEO Difficulty."
    },
    {
      number: "03",
      title: "Launch with Confidence",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: "Use our in-depth reports and competitor deep-scans to build a winning strategy and dominate your market."
    }
  ];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-6xl font-bold text-gray-900 lg:text-7xl tracking-tight">
            From Idea to Intelligence
          </h2>
          <p className="mt-4 text-lg lg:text-2xl text-gray-600">
            Our tool simplifies brand analysis into three straightforward steps.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Steps */}
          <div className="space-y-10">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-900 text-white flex items-center justify-center mr-6">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Image */}
          <div className="flex items-center justify-center">
            <Image
              src="/howitworks.png"
              alt="A person working on a laptop showing data analytics"
              width={600}
              height={600}
              className="rounded-xl shadow-2xl w-full h-auto max-w-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}