'use client';

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Analyze",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      description: "Enter your brand name and industry. Our engine instantly checks domain availability and runs AI-powered analyses on Google search results."
    },
    {
      number: "02", 
      title: "Review",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: "Get a clear, actionable dashboard with scores for Domain Strength, Competition, and SEO Difficulty. Understand your brand's potential in seconds."
    },
    {
      number: "03",
      title: "Dominate", 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: "Launch a Deep Scan on any competitor. Uncover their tech stack, on-page strategy, and get an AI-generated \"Strategic Battle Plan\" to win."
    }
  ];

  return (
    <section className="py-32 bg-[#212121]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            From Idea to Intelligence in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] to-[#764ba2]">
              3 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Visually explain the simple, 3-step process to demystify the tool.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connection Line (visible on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] opacity-60 transform -translate-x-6 translate-y-0.5 z-0 rounded-full shadow-lg"></div>
              )}
              
              {/* Mobile Connection Line */}
              {index < steps.length - 1 && (
                <div className="md:hidden absolute -bottom-4 left-1/2 w-1 h-8 bg-gradient-to-b from-[#667eea] to-[#764ba2] opacity-60 transform -translate-x-0.5 z-0 rounded-full"></div>
              )}
              
              {/* Step Card */}
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2 z-10">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 rounded-xl flex items-center justify-center text-[#667eea] mb-6 mx-auto">
                  {step.icon}
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-full">
            <svg className="w-5 h-5 text-[#667eea] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[#667eea] font-semibold">Ready to get started? Try it free above!</span>
          </div>
        </div>
      </div>
    </section>
  );
} 