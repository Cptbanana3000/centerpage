'use client';

import { Clock, Users, Layers, Rocket, PieChart, BrainCircuit, Receipt, HandCoins } from 'lucide-react';

// Make sure you have Font Awesome loaded in your project for the icons to appear.
// For example, in your layout.js or _app.js: import '@fortawesome/fontawesome-free/css/all.min.css';

export function WhyChooseUs() {
  const points = [
    {
      title: "4 AI Experts in 2 Minutes, Not Hours of Research",
      oldWay: {
        description: "Spending 3-5 hours juggling domain registrars, Google searches, Ahrefs, and Wappalyzer to manually piece together competitor insights.",
        icon: Clock,
      },
      centerPageWay: {
        description: "Our AI team (SEO Strategist, Tech Analyst, Brand Consultant, Strategic Advisor) works simultaneously to deliver professional grade analysis in minutes. Like having a $2000/day consulting team.",
        icon: Users,
      },
    },
    {
      title: "Real-Time Intelligence, Not Outdated Databases", 
      oldWay: {
        description: "Getting stale data from expensive tools that charge $200+/month for information that might be weeks or months old.",
        icon: Layers,
      },
      centerPageWay: {
        description: "Live web scraping with 95% tech stack accuracy. We analyze competitors in real time, not from cached databases. Fresh insights every single search.",
        icon: Rocket,
      },
    },
    {
      title: "Strategic Insights, Not Just Data Dumps",
      oldWay: {
        description: "Endless charts and technical metrics from enterprise tools that leave you to figure out what it all means for your specific situation.",
        icon: PieChart,
      },
      centerPageWay: {
        description: "Our AI doesn't just show you numbers; it synthesizes findings into plain-English recommendations and actionable strategic battle plans. No SEO expertise required.",
        icon: BrainCircuit,
      },
    },
    {
      title: "Pay-Per-Use Credits, Not Predatory Subscriptions",
      oldWay: {
        description: "Getting locked into $129-299/month subscriptions for massive toolkits where you only need name validation occasionally, not daily.",
        icon: Receipt,
      },
      centerPageWay: {
        description: "One-time credit packs that combine domain checks + SEO analysis + competitor intelligence + tech detection. Get $500+ consultant-level insights without the commitment.",
        icon: HandCoins,
      },
    },
  ];

  return (
    <section id="whyChooseUs" className="bg-white py-24 sm:py-32">
      <div className="container mx-auto px-4">

        {/* Header Section */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-6xl font-bold text-gray-900 lg:text-7xl tracking-tight">
            A Founder's Focus, Not an Enterprise Maze
          </h2>
          <p className="text-lg lg:text-2xl text-gray-600 leading-relaxed">
            You don't need another overwhelming dashboard. You need the right insights, right now. Here's how our approach is different.
          </p>
        </div>

        {/* New Comparative Layout */}
        <div className="flex flex-col gap-16">
          {points.map((point, index) => (
            <div key={index}>
              {/* Section Title */}
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-10">
                {point.title}
              </h3>
              
              {/* Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                
                {/* The Old Way */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <point.oldWay.icon className="h-8 w-8 text-slate-500 shrink-0" />
                    <h4 className="font-bold text-xl text-slate-600">The Old Way</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{point.oldWay.description}</p>
                </div>

                {/* The CenterPage Way */}
                <div className="bg-white border-4 border-gray-900 rounded-xl p-8 h-full shadow-2xl group transition-transform transform hover:scale-105 hover:shadow-2xl">
                   <div className="flex items-center gap-4 mb-4">
                     <point.centerPageWay.icon className="h-8 w-8 text-gray-900 shrink-0 transition-transform transform group-hover:scale-110" />
                     <h4 className="font-bold text-xl text-gray-900">The CenterPage Way</h4>
                   </div>
                   <p className="text-gray-700 leading-relaxed">{point.centerPageWay.description}</p>
                </div>

              </div>
            </div>
          ))}

            <div className="mt-16 text-center">
              <div className="bg-white border-2 border-gray-900 rounded-xl p-8 h-full shadow-2xl group transition-transform transform hover:scale-105 hover:shadow-2xl">
                <p className="text-gray-700 text-lg">
                  <strong>Stop wasting time,spending hours and hundreds or dollars on tools that don't deliver</strong><br />
                  Get enterprise-grade insights with our AI expert team.Check our pricing Section to get started.
                </p>
              </div>
            </div>
        </div>

      </div>
    </section>
  );
}
