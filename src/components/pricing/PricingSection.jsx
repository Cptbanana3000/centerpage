'use client';

// Note: The SignUpDialog is imported but its usage would need to be implemented
// (e.g., wrapping the free plan button).
import { Button } from '@/components/ui/button';
import { SignUpDialog } from '@/components/auth/SignUpDialog';

export function PricingSection() {
  const plans = [
    {
      name: 'Explorer',
      price: '$0',
      description: 'Experience the core power of the tool, on us.',
      features: [
        { text: '5 Free Standard Analyses', included: true, note: '(one-time)' },
        { text: 'Full Standard Report Access', included: true },
        { text: 'Deep Scan AI Report', included: false, note: '(Locked)' },
      ],
      isFree: true,
    },
    {
      name: 'Starter Pack',
      price: '$4.99',
      originalPrice: '$7.99',
      description: 'For a focused brainstorming session to find a great name.',
      features: [
        { text: '25 Standard Analyses', included: true },
        { text: '10 Deep Scan Reports', included: true },
      ],
      isBestValue: false,
    },
    {
      name: 'Pro Pack',
      price: '$9.99',
      originalPrice: '$14.99',
      description: 'For comprehensive research on one or more projects.',
      features: [
        { text: '75 Standard Analyses', included: true },
        { text: '35 Deep Scan Reports', included: true },
      ],
      isBestValue: true,
    },
  ];

  const CheckIcon = () => (
    <svg className="w-5 h-5 text-[#64ffda] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
  );

  const CrossIcon = () => (
    <svg className="w-5 h-5 text-[#8892b0] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  );

  return (
    <section id="pricing" className="min-h-screen bg-[#0a192f] text-white py-24 sm:py-32 relative overflow-hidden font-['Inter',_sans-serif]">
      <div className="container mx-auto px-4 relative z-10">

        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            Simple, Value-Driven Pricing
          </h2>
          <p className="text-lg lg:text-xl text-[#8892b0] leading-relaxed">
            Our one-time packs align with your process. Explore freely, then get deep validation for your best ideas—no subscription needed.
          </p>
        </div>

        {/* Pricing Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col bg-[rgba(255,255,255,0.05)] border backdrop-blur-lg rounded-xl p-8 transition-all duration-300 hover:-translate-y-2
                ${plan.isBestValue ? 'border-[rgba(100,255,218,0.5)]' : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(100,255,218,0.5)]'}
              `}
            >
              {plan.isBestValue && (
                <div className="absolute top-0 right-8 -mt-4 bg-[#64ffda] text-[#0a192f] text-sm font-bold px-4 py-1 rounded-full">
                  BEST VALUE
                </div>
              )}

              <div className="flex-grow">
                <h3 className={`text-2xl font-bold mb-2 ${plan.isBestValue ? 'text-[#64ffda]' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <p className="text-[#8892b0] h-12">
                  {plan.description}
                </p>
                <div className="my-8">
                  <span className="text-5xl font-extrabold text-[#ccd6f6]">{plan.price}</span>
                  {plan.originalPrice && (
                    <span className="text-2xl text-[#8892b0] line-through ml-2">{plan.originalPrice}</span>
                  )}
                </div>
                <ul className="space-y-4 text-[#ccd6f6]">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start">
                      {feature.included ? <CheckIcon /> : <CrossIcon />}
                      <span>
                        <span className="font-semibold">{feature.text}</span>
                        {feature.note && <span className="text-[#8892b0] ml-1">{feature.note}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                className={`mt-8 w-full font-bold py-3 rounded-lg transition-all duration-300 text-lg
                  ${plan.isFree ? 'bg-transparent border-2 border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10' : 'bg-[#64ffda] text-[#0a192f] hover:bg-white'}
                `}
              >
                {plan.isFree ? 'Start for Free' : `Buy ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
