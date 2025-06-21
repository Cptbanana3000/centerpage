'use client';

// Make sure you have Font Awesome loaded in your project for the icons to appear.
// For example, in your layout.js or _app.js: import '@fortawesome/fontawesome-free/css/all.min.css';

export function WhyChooseUs() {
  const points = [
    {
      title: "A Seamless Workflow, Not a Dozen Open Tabs",
      oldWay: {
        description: "Juggling your domain registrar, multiple Google searches, and a separate SEO tool, trying to connect the dots yourself in a spreadsheet.",
        icon: "fa-layer-group",
      },
      veritoWay: {
        description: "One search bar, one category, one unified dashboard. We combine domain availability, real-time Google search analysis, and deep competitor insights into a single, intelligent workflow.",
        icon: "fa-rocket",
      }
    },
    {
      title: "Strategic Insights, Not Just Data Dumps",
      oldWay: {
        description: "\"Enterprise-grade\" tools give you endless charts and data tables, leaving you to figure out what it all means.",
        icon: "fa-chart-pie",
      },
      veritoWay: {
        description: "Our AI doesn't just show you numbers; it gives you a clear verdict and a \"Strategic Battle Plan.\" It's like having an experienced marketing strategist on your team.",
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
    <section className="py-24 sm:py-32 bg-[#0a192f] text-[#8892b0] font-['Inter',_sans-serif]">
      <div className="container mx-auto px-4">

        {/* Header Section */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            A Founder's Focus, Not an Enterprise Maze
          </h2>
          <p className="text-lg lg:text-xl leading-relaxed">
            You don't need another overwhelming dashboard or a $500/month subscription. You need the right insights, right now. Here's why our approach is different.
          </p>
        </div>

        {/* New Comparative Layout */}
        <div className="flex flex-col gap-20">
          {points.map((point, index) => (
            <div key={index}>
              {/* Section Title */}
              <h3 className="text-2xl lg:text-3xl font-bold text-[#ccd6f6] text-center mb-10">
                {index + 1}. {point.title}
              </h3>
              
              {/* Comparison Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                
                {/* The Old Way */}
                <div className="bg-[rgba(50,60,80,0.2)] border border-[rgba(255,255,255,0.05)] rounded-xl p-8 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <i className={`fas ${point.oldWay.icon} text-[#8892b0] text-2xl`}></i>
                    <h4 className="font-bold text-xl text-[#8892b0]">The Old Way</h4>
                  </div>
                  <p className="text-[#8892b0] leading-relaxed">{point.oldWay.description}</p>
                </div>

                {/* The Verito Way */}
                <div className="relative bg-[rgba(100,255,218,0.05)] border border-[rgba(100,255,218,0.2)] rounded-xl p-8 h-full">
                   {/* Glow effect */}
                   <div className="absolute -inset-px bg-gradient-to-r from-[#64ffda] to-transparent rounded-xl opacity-30 blur-lg" aria-hidden="true"></div>
                   <div className="relative">
                      <div className="flex items-center gap-4 mb-4">
                        <i className={`fas ${point.veritoWay.icon} text-[#64ffda] text-2xl`}></i>
                        <h4 className="font-bold text-xl text-[#64ffda]">The Verito Way</h4>
                      </div>
                      <p className="text-[#ccd6f6] leading-relaxed">{point.veritoWay.description}</p>
                   </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
