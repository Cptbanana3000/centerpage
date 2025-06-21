'use client';

// Make sure you have Font Awesome loaded in your project for the icons to appear.
// For example, in your layout.js or _app.js: import '@fortawesome/fontawesome-free/css/all.min.css';

export function Features() {
  const features = [
    {
      title: 'Domain Analysis',
      description: 'Check domain availability across multiple TLDs and get AI-powered alternative suggestions.',
      icon: 'fa-globe',
    },
    {
      title: 'Competition Analysis',
      description: 'Discover existing businesses using similar names and assess market saturation.',
      icon: 'fa-chart-pie',
    },
    {
      title: 'SEO Viability',
      description: 'Evaluate search engine optimization potential and keyword competition instantly.',
      icon: 'fa-magnifying-glass-chart',
    },
  ];

  return (
    // Matching the background color and font colors from the Hero section
    <section className="py-24 sm:py-32 bg-[#0a192f] text-[#8892b0] font-['Inter',_sans-serif]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <div className="order-last lg:order-first">
             {/* Using a standard <img> tag and a placeholder for broader compatibility */}
            <img
              src="/features.png"
              alt="A person analyzing brand data on a laptop"
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </div>

          {/* Text Content Column */}
          <div className="max-w-xl">
            {/* Using text-white for the main heading for emphasis, like in Hero */}
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
              Comprehensive Brand Analysis
            </h2>
            <p className="text-lg lg:text-xl leading-relaxed mb-12">
              Get a complete picture of your brand name's viability with our powerful analysis tools.
            </p>

            {/* Features List */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start"
                >
                  {/* Using the same accent color scheme for icons as the Hero button */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#64ffda] flex items-center justify-center">
                    <i className={`fas ${feature.icon} text-[#0a192f] text-xl`}></i>
                  </div>
                  <div className="ml-5">
                    {/* Matching card title and description colors */}
                    <h3 className="text-xl font-bold text-[#ccd6f6] mb-2">{feature.title}</h3>
                    <p className="text-[#8892b0]">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
