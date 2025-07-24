'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { SignUpDialog } from '@/components/auth/SignUpDialog';
import { useRouter } from 'next/navigation';
import { PaymentSuccessModal } from './PaymentSuccessModal';

export function PricingSection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchasedPack, setPurchasedPack] = useState('');
  const router = useRouter();

  // Check for payment success on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentSuccess = urlParams.get('payment_success');
      const pack = urlParams.get('pack');
      
      if (paymentSuccess === 'true' && pack) {
        setPurchasedPack(decodeURIComponent(pack));
        setShowSuccessModal(true);
        
        // Clean up URL parameters
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('payment_success');
        newUrl.searchParams.delete('pack');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  const plans = [
    // {
    //   name: 'Explorer',
    //   price: '$0',
    //   description: 'Experience the core power of the tool, on us.',
    //   features: [
    //     { text: '5 Free Standard Analyses', included: true, note: '(one-time)' },
    //     { text: 'Full Standard Report Access', included: true },
    //     { text: 'Deep Scan AI Report', included: false, note: '(Locked)' },
    //   ],
    //   isFree: true,
    //   buttonText: 'Start for Free',
    //   buttonVariant: 'outline',
    // },
    {
      name: 'Basic Pack',
      priceId: 'pri_01k0vm1yfrvn3v59fxk3dgskvm', // LIVE Basic Pack
      price: '$7.99',
      originalPrice: '$19.99',
      description: 'For basic analysis and scoring of brand names.',
      features: [
        { text: '10 Standard Analyses', included: true },
        { text: 'Full Standard Report Access', included: true },
        { text: 'Domain Availability Check', included: true },
        { text: 'Google Search Competitions', included: true },
        { text: 'SEO Difficulty Analysis', included: true },
        { text: 'Tech-Stack identification', included: false },
        
        { text: 'Deep Scan AI Report', included: false, note: '(Locked)' },
        { text: 'Export PDF', included: false, note: '(Locked)' },
      ],
      isBestValue: false,
      buttonText: 'Buy Basic Pack',
      buttonVariant: 'default',
    },
    {
      name: 'Starter Pack',
      priceId: 'pri_01k0ve17dkeyngtaaxxq7z8kwh', // LIVE Starter Pack
      price: '$19.99',
      originalPrice: '$39.99',
      description: 'For a focused brainstorming session to find a great name.',
      features: [
        { text: '15 Standard Analyses', included: true },
        { text: '7 Deep Scan Reports', included: true },
        { text: 'Domain Availability Check', included: true },
        { text: 'Google Search Competitions', included: true },
        { text: 'SEO Difficulty Analysis', included: true },
        { text: 'Export PDF', included: true },
        { text: 'Tech-Stack identification', included: true },
        { text: 'Technical Analysis', included: true },
        { text: 'Content & SEO Analysis', included: true },
        { text: 'Visual & UX Analysis', included: true },
        { text: 'Priority Support', included: false },
      ],
      isBestValue: false,
      isPopular: true,
      buttonText: 'Buy Starter Pack',
      buttonVariant: 'default',
    },
    {
      name: 'Founders Pack',
      priceId: 'pri_01k0ve2teb9v06hja453btj2kv', // LIVE Founders Pack
      price: '$39.99',
      originalPrice: '$79.99',
      description: 'For comprehensive research on one or more projects.',
      features: [
        { text: '30 Standard Analyses', included: true },
        { text: '14 Deep Scan Reports', included: true },
        { text: 'Domain Availability Check', included: true },
        { text: 'Google Search Competitions', included: true },
        { text: 'SEO Difficulty Analysis', included: true },
        { text: 'Export PDF', included: true },
        { text: 'Tech-Stack identification', included: true },
        { text: 'Technical Analysis', included: true },
        { text: 'Content & SEO Analysis', included: true },
        { text: 'Visual & UX Analysis', included: true },
        { text: 'Priority Support', included: true },
      ],
      isBestValue: true,
      buttonText: 'Buy Founders Pack',
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
      // Store the purchased pack name for the success modal
      setPurchasedPack(plan.name);
      
      window.Paddle.Checkout.open({
        settings: {
          successUrl: `${window.location.origin}?payment_success=true&pack=${encodeURIComponent(plan.name)}`,
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

  const CheckIcon = ({ isDark = false }) => (
    <svg className={`w-5 h-5 mr-3 flex-shrink-0 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
  );

  const CrossIcon = ({ isDark = false }) => (
    <svg className={`w-5 h-5 mr-3 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            Our one-time packs align with your process. Explore freely, then get deep validation for your best ideas. No subscription needed.
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
              {plan.isPopular && (
                <div className="absolute top-0 left-8 -mt-4 bg-blue-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                  POPULAR
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
                      {feature.included ? <CheckIcon isDark={plan.isBestValue} /> : <CrossIcon isDark={plan.isBestValue} />}
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
      
      {/* Payment Success Modal */}
      <PaymentSuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        purchasedPack={purchasedPack}
      />
    </section>
  );
}
