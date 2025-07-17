'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, X } from 'lucide-react';

export function PaymentSuccessModal({ isOpen, onClose, purchasedPack }) {
  const { user } = useAuth();
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      fetchCredits();
    }
  }, [isOpen, user]);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user-credits', {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAnalyzing = () => {
    onClose();
    // You can add navigation logic here if needed
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 cursor-pointer group"
        >
          <X className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
        </button>

        <DialogHeader className="text-center pt-6 pb-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </DialogTitle>
          <p className="text-lg text-gray-600 leading-relaxed">
            Thank you for your purchase! Your credits have been added to your account and are ready to use.
          </p>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {purchasedPack && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-sm">
              <h3 className="font-bold text-blue-900 text-lg mb-2">Purchased: {purchasedPack}</h3>
              <p className="text-blue-700">
                Your credits are ready to use immediately.
              </p>
            </div>
          )}

          {credits && !loading && (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h3 className="font-bold text-gray-900 text-lg mb-4 text-center">Your Updated Credits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{credits.standardAnalyses || 0}</div>
                  <div className="text-sm text-gray-600 font-medium">Standard Analyses</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{credits.deepScans || 0}</div>
                  <div className="text-sm text-gray-600 font-medium">Deep Scans</div>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
              <span className="ml-3 text-gray-600 font-medium">Loading your credits...</span>
            </div>
          )}

          <div className="space-y-4 pt-2">
            <Button 
              onClick={handleStartAnalyzing}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
            >
              Start Analyzing Names
            </Button>
            
            <Button 
              onClick={handleClose}
              variant="outline"
              className="w-full border-2 border-gray-300 text-gray-700  font-semibold py-3 px-6 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Continue Browsing
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              A receipt has been sent to your email. Need help?{' '}
              <a 
                href="mailto:support@getcenterpage.com" 
                className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 