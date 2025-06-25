'use client';

// Make sure you have Font Awesome loaded in your project for the icons to appear.
// For example, in your layout.js or _app.js: import '@fortawesome/fontawesome-free/css/all.min.css';

export function WhyChooseUs() {
  const points = [
    {
      title: "A Seamless Workflow, Not a Dozen Open Tabs",
      oldWay: {
        description: "Juggling your domain registrar, multiple Google searches, and an SEO tool, trying to connect the dots yourself in a spreadsheet.",
        icon: "fa-layer-group",
      },
      veritoWay: {
        description: "One search bar, one category, one unified dashboard. We combine domain availability, Google search analysis, and competitor insights into a single workflow.",
        icon: "fa-rocket",
      }
    },
    {
      title: "Strategic Insights, Not Just Data Dumps",
      oldWay: {
        description: "Endless charts and data tables from enterprise-grade tools that leave you to figure out what it all means.",
        icon: "fa-chart-pie",
      },
      veritoWay: {
        description: "Our AI doesn't just show you numbers; it gives you a clear verdict and a 'Strategic Battle Plan.' It's like having an experienced marketing strategist on your team.",
        icon: "fa-brain",
      }
    },
    {
      title: "Value-Driven Packs, Not Predatory Subscriptions",
      oldWay: {
        description: "Getting locked into a costly monthly subscription for a massive toolkit where you only use 5% of the features.",
        icon: "fa-file-invoice-dollar",
      },
      veritoWay: {
        description: "Our one-time credit packs give you access to powerful, professional-grade analysis without the long-term commitment. Solve your problem and get back to building.",
        icon: "fa-hand-holding-dollar",
      }
    }
  ];

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container mx-auto px-4">

        {/* Header Section */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-6xl lg:text-2xl font-bold text-gray-900 mb-4 tracking-tight">
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
                    <i className={`fas ${point.oldWay.icon} text-slate-500 text-2xl`}></i>
                    <h4 className="font-bold text-xl text-slate-600">The Old Way</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{point.oldWay.description}</p>
                </div>

                {/* The Verito Way */}
                <div className="bg-white border-4 border-gray-900 rounded-xl p-8 h-full shadow-2xl group transition-transform transform hover:scale-105 hover:shadow-2xl">
                   <div className="flex items-center gap-4 mb-4">
                     <i className={`fas ${point.veritoWay.icon} text-gray-900 text-2xl transition-transform transform group-hover:scale-110`}></i>
                     <h4 className="font-bold text-xl text-gray-900">The Verito Way</h4>
                   </div>
                   <p className="text-gray-700 leading-relaxed">{point.veritoWay.description}</p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
