'use client';

export function Features() {
  const features = [
    {
      title: 'Domain Analysis',
      description: 'Check domain availability across multiple TLDs and get alternative suggestions.',
      icon: 'fa-globe-americas',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Competition Analysis',
      description: 'Discover existing businesses using similar names and assess market saturation.',
      icon: 'fa-chart-line',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'SEO Viability',
      description: 'Evaluate search engine optimization potential and keyword competition.',
      icon: 'fa-search',
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <section className="py-20 bg-[#212121]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Comprehensive Brand Analysis
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get a complete picture of your brand name's viability with our powerful analysis tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                <i className={`fas ${feature.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 