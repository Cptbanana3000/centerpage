'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Microscope, Check, Star } from 'lucide-react';

const creditPacks = [
  {
    id: 'starter',
    name: 'Starter Pack',
    price: 4.99,
    originalPrice: 7.99,
    standardAnalyses: 25,
    deepScans: 10,
    popular: false,
    description: 'For a focused brainstorming session to find a great name',
    features: [
      '25 Standard Brand Analyses',
      '10 Deep Competitor Scans',
      '10 PDF Report Exports',
      'Domain availability checks',
      'Competition analysis',
      'SEO difficulty scoring'
    ]
  },
  {
    id: 'professional',
    name: 'Pro Pack',
    price: 9.99,
    originalPrice: 14.99,
    standardAnalyses: 75,
    deepScans: 35,
    popular: true,
    description: 'For comprehensive research on one or more projects',
    features: [
      '75 Standard Brand Analyses',
      '35 Deep Competitor Scans',
      '35 PDF Report Exports',
      'All Starter features',
      'Best value for power users',
      'Advanced AI insights'
    ]
  }
];

export function CreditPacks({ onClose }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(null);

  const handlePurchase = async (pack) => {
    if (!user) {
      alert('Please log in to purchase credits.');
      return;
    }

    setLoading(pack.id);
    
    // Simulate purchase process (in production, integrate with Stripe or similar)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, this would integrate with your payment processor
      // and update the user's credits in Firestore
      
      alert(`Successfully purchased ${pack.name}! Your credits have been added to your account.`);
      
      // Close the modal and refresh credits
      if (onClose) onClose();
      
      // Refresh the page to update credit displays
      window.location.reload();
      
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Credit Pack</h1>
          <p className="text-lg text-gray-400 mb-6">
            Get started with our flexible, one-time credit packages. No subscriptions, no commitments.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Standard Analyses: Domain & competition checks</span>
            </div>
            <div className="flex items-center gap-2">
              <Microscope className="w-4 h-4 text-purple-400" />
              <span>Deep Scans: AI analysis & PDF exports</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          {creditPacks.map((pack) => (
            <Card 
              key={pack.id} 
              className={`relative bg-white/5 border ${pack.popular ? 'border-purple-400' : 'border-white/10'} ${pack.popular ? 'transform scale-105' : ''}`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-white mb-2">{pack.name}</CardTitle>
                <div className="text-3xl font-bold text-white mb-2 flex items-baseline justify-center gap-2">
                  <span>${pack.price}</span>
                  {pack.originalPrice && (
                    <span className="text-lg font-normal text-gray-400 line-through">${pack.originalPrice}</span>
                  )}
                  <span className="text-lg font-normal text-gray-400"> one-time</span>
                </div>
                <p className="text-gray-400 text-sm">{pack.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex justify-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-2xl font-bold text-blue-400">{pack.standardAnalyses}</span>
                    </div>
                    <div className="text-xs text-gray-400">Standard</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Microscope className="w-4 h-4 text-purple-400" />
                      <span className="text-2xl font-bold text-purple-400">{pack.deepScans}</span>
                    </div>
                    <div className="text-xs text-gray-400">Deep Scans</div>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {pack.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePurchase(pack)}
                  disabled={loading === pack.id}
                  className={`w-full ${pack.popular 
                    ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  } font-semibold`}
                >
                  {loading === pack.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `Purchase ${pack.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">
            Need more credits? Contact us for custom enterprise packages.
          </p>
          {onClose && (
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              Continue with current credits
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 