'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { SignUpDialog } from '@/components/auth/SignUpDialog';
import { useRouter } from 'next/navigation';

export function PricingSection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState('');
  const router = useRouter();

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
      buttonText: 'Start for Free',
      buttonVariant: 'outline',
    },
    {
      name: 'Starter Pack',
      priceId: 'pri_01jypm11t9pdaeqdeygkg132at', // TODO: Replace with your actual price ID from Paddle
      price: '$4.99',
      originalPrice: '$7.99',
      description: 'For a focused brainstorming session to find a great name.',
      features: [
        { text: '25 Standard Analyses', included: true },
        { text: '10 Deep Scan Reports', included: true },
      ],
      isBestValue: false,
      buttonText: 'Buy Starter Pack',
      buttonVariant: 'default',
    },
    {
      name: 'Pro Pack',
      priceId: 'pri_01jypnx15gmrp3csr9wtvrrykq', // TODO: Replace with your actual price ID from Paddle
      price: '$9.99',
      originalPrice: '$14.99',
      description: 'For comprehensive research on one or more projects.',
      features: [
        { text: '75 Standard Analyses', included: true },
        { text: '35 Deep Scan Reports', included: true },
      ],
      isBestValue: true,
      buttonText: 'Buy Pro Pack',
      buttonVariant: 'default',
    },
  ];

  const handlePurchase = (plan) => {
    if (!user) {
      // Maybe trigger a sign-in/sign-up modal here
      router.push('/dashboard'); // Or redirect to a login page
      return;
    }

    if (typeof window.Paddle === 'undefined') {
      console.error('Paddle.js has not loaded yet.');
      alert('Payment provider is not ready. Please try again in a moment.');
      return;
    }

    setLoading(plan.name);

    try {
      window.Paddle.Checkout.open({
        settings: {
          successUrl: `${window.location.origin}/dashboard`,
        },
        items: [{ priceId: plan.priceId, quantity: 1 }],
        customer: {
          email: user.email,
        },
        customData: {
          userId: user.uid,
        },
      });
    } catch (error) {
      console.error('Paddle Checkout error:', error);
      alert('Could not open checkout. Please try again.');
    } finally {
      setTimeout(() => setLoading(''), 3000);
    }
  };

  const CheckIcon = () => (
    <svg className="w-5 h-5 text-gray-900 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
  );

  const CrossIcon = () => (
    <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  );

  return (
    <section id="pricing" className="bg-white text-gray-900 py-24 sm:py-32">
      <div className="container mx-auto px-4">

        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-4 tracking-tight">
            Simple, Value-Driven Pricing
          </h2>
          <p className="text-lg lg:text-2xl text-gray-600 leading-relaxed">
            Our one-time packs align with your process. Explore freely, then get deep validation for your best ideas—no subscription needed.
          </p>
        </div>

        {/* Pricing Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl p-8 transition-all duration-300
                ${plan.isBestValue 
                  ? 'bg-gray-900 text-white border-2 border-gray-900 shadow-2xl scale-105' 
                  : 'bg-slate-50 border border-slate-200'
                }
              `}
            >
              {plan.isBestValue && (
                <div className="absolute top-0 right-8 -mt-4 bg-yellow-300 text-gray-900 text-sm font-bold px-4 py-1 rounded-full">
                  BEST VALUE
                </div>
              )}

              <div className="flex-grow">
                <h3 className={`text-2xl font-bold mb-2 ${plan.isBestValue ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`${plan.isBestValue ? 'text-gray-300' : 'text-gray-600'} h-12`}>
                  {plan.description}
                </p>
                <div className="my-8">
                  <span className={`text-5xl font-extrabold ${plan.isBestValue ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                  {plan.originalPrice && (
                    <span className={`text-2xl ${plan.isBestValue ? 'text-gray-400' : 'text-gray-400'} line-through ml-2`}>{plan.originalPrice}</span>
                  )}
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start">
                      {feature.included ? <CheckIcon /> : <CrossIcon />}
                      <span className={`${plan.isBestValue ? 'text-gray-200' : 'text-gray-700'}`}>
                        <span className="font-semibold">{feature.text}</span>
                        {feature.note && <span className={`${plan.isBestValue ? 'text-gray-400' : 'text-gray-500'} ml-1`}>{feature.note}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                onClick={() => plan.isFree ? router.push('/dashboard') : handlePurchase(plan)}
                disabled={loading === plan.name}
                className={`mt-8 w-full font-bold py-3 rounded-lg text-lg h-14 cursor-pointer
                  ${plan.isBestValue 
                    ? 'bg-white text-gray-900 hover:bg-gray-200' 
                    : plan.isFree
                      ? 'bg-transparent border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                      : 'bg-gray-900 text-white hover:bg-gray-700'
                  }
                `}
              >
                {loading === plan.name ? 'Processing...' : plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
