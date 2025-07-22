'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Check, X } from 'lucide-react';

export function PaymentSuccessModal({ isOpen, onClose, purchasedPack }) {
  const { user } = useAuth();

  const handleStartAnalyzing = () => {
    onClose();
    // You can add navigation logic here if needed
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-0">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 cursor-pointer group z-10"
        >
          <X className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
        </button>

        <div className="text-center pt-8 pb-6 px-6">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          
          {/* Title - Hidden for screen readers but required for accessibility */}
          <DialogTitle className="sr-only">
            Payment Complete
          </DialogTitle>
          
          {/* Visual Title */}
          <h2 className="text-2xl font-bold text-black mb-2">
            Payment Complete
          </h2>
          
          {/* Message */}
          <p className="text-gray-600 mb-6">
            Your {purchasedPack} has been activated and credits are ready to use.
          </p>

          {/* Package Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Package</span>
              <span className="font-bold text-black">{purchasedPack}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleStartAnalyzing}
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Start Analyzing
            </Button>
            
            <Button 
              onClick={handleClose}
              variant="outline"
              className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:border-gray-400"
            >
              Continue
            </Button>
          </div>

          {/* Footer */}
          <div className="pt-4 mt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Receipt sent via email •{' '}
              <a 
                href="mailto:support@getcenterpage.com" 
                className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                Support
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 