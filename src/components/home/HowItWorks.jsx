'use client';

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Analyze",
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      description: "Enter your brand name and industry. Our engine instantly checks domain availability and runs AI-powered analyses on Google search results."
    },
    {
      number: "02",
      title: "Review",
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: "Get a clear, actionable dashboard with scores for Domain Strength, Competition, and SEO Difficulty."
    },
    {
      number: "03",
      title: "Dominate",
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: "Launch a Deep Scan on any competitor. Uncover their tech stack and on-page strategy to win."
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-[#0a192f] text-[#8892b0] font-['Inter',_sans-serif]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Text Content and Steps Column */}
          <div className="order-1 lg:order-1 max-w-none lg:max-w-xl xl:max-w-2xl">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-black text-white mb-3 sm:mb-4 tracking-tight leading-tight">
                From Idea to Intelligence
              </h2>
              <p className="text-base sm:text-lg lg:text-lg xl:text-xl leading-relaxed mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto lg:mx-0">
                Our tool simplifies brand analysis into three straightforward steps.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg bg-[#64ffda] flex items-center justify-center mr-4 sm:mr-5 lg:mr-6 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                    <span className="text-[#0a192f] transition-transform duration-300 group-hover:scale-110">
                      {step.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#ccd6f6] mb-1 sm:mb-2 transition-colors duration-300 group-hover:text-[#64ffda]">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#8892b0] leading-relaxed pr-2">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Column */}
          <div className="order-1 lg:order-2 w-full">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#64ffda] to-[#4fc3f7] rounded-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              <img
                src="/howitworks.png"
                alt="A person working on a laptop showing data analytics"
                className="relative rounded-xl shadow-2xl w-full h-auto max-w-md sm:max-w-lg lg:max-w-none mx-auto lg:mx-0 transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}