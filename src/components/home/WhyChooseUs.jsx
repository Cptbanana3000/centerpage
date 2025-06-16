'use client';

export function WhyChooseUs() {
  const points = [
    {
      title: "Built for Branding",
      subtitle: "The Right Workflow",
      description: "Enterprise tools are clunky Swiss Army knives. We are a specialized laser focused on one thing: helping you validate and launch your brand with confidence.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Modern AI, Not Just Data",
      subtitle: "Smarter, Not Just Bigger",
      description: "Other tools give you overwhelming charts. Our AI gives you strategic insights and tells you what the data means for your specific industry.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Pay For What You Need",
      subtitle: "No Subscriptions",
      description: "Solve your problem without getting locked into a costly monthly subscription you don't need. Our one-time packs align with your project-based workflow.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-32 bg-[#212121]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            A Founder's Focus,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] to-[#764ba2]">
              Not an Enterprise Maze
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Why choose our tool over big, expensive enterprise platforms? We're built specifically for founders who need results, not complexity.
          </p>
        </div>

        {/* Comparison Points */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {points.map((point, index) => (
            <div key={index} className="relative group">
              {/* Card */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 h-full">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 rounded-xl flex items-center justify-center text-[#667eea] mb-6">
                  {point.icon}
                </div>

                {/* Content */}
                <div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-[#667eea] mb-2 uppercase tracking-wide">
                      {point.subtitle}
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {point.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {point.description}
                  </p>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#667eea] to-[#764ba2] opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center">
            <div className="flex items-center mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-[#667eea] to-transparent w-20"></div>
              <svg className="w-6 h-6 text-[#667eea] mx-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <div className="h-px bg-gradient-to-r from-transparent via-[#667eea] to-transparent w-20"></div>
            </div>
            <p className="text-gray-400 text-lg">
              Ready to experience the difference? <span className="text-[#667eea] font-semibold">Try it now.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 