'use client';

import Image from 'next/image';
import { Globe, PieChart, AreaChart } from 'lucide-react';

// Make sure you have Font Awesome loaded in your project for the icons to appear.
// For example, in your layout.js or _app.js: import '@fortawesome/fontawesome-free/css/all.min.css';

export function Features() {
  const features = [
    {
      title: 'AI-Powered Domain Analysis',
      description: 'Instantly check domain availability across key TLDs and get smart, brandable alternatives.',
      icon: Globe,
    },
    {
      title: 'In-Depth Competition Analysis',
      description: 'Discover existing businesses using similar names and assess market saturation with our AI.',
      icon: PieChart,
    },
    {
      title: 'Actionable SEO Viability',
      description: 'Evaluate your name\'s SEO potential and get a clear picture of the keyword competition.',
      icon: AreaChart,
    },
  ];

  return (
    <section id="Features" className="py-24 sm:py-32 bg-white text-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Column */}
          <div className="flex items-center justify-center">
            <Image
              src="/features.png"
              alt="A person analyzing brand data on a laptop"
              width={700}
              height={500}
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </div>

          {/* Text Content Column */}
          <div className="max-w-xl">
            <h2 className="text-6xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              A Complete Brand Toolkit
            </h2>
            <p className="text-lg lg:text-2xl text-gray-600 leading-relaxed mb-12">
              Go beyond simple name checking. Get a full strategic analysis to ensure your brand is built to last.
            </p>

            {/* Features List */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-900 text-white flex items-center justify-center">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
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
