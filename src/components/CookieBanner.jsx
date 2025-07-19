'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie } from 'lucide-react';
// Removed Button import for brutalism design

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white border-t-4 md:border-t-8 border-yellow-400 shadow-2xl">
      <div className="w-full px-4 py-4 md:px-8 md:py-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-3 md:gap-6">
          {/* Content */}
          <div className="flex items-start gap-2 md:gap-4 flex-1">
            <Cookie className="h-5 w-5 md:h-8 md:w-8 text-yellow-400 mt-1 flex-shrink-0" />
            <div className="text-white">
              <p className="text-sm md:text-lg font-bold mb-2 md:mb-3 uppercase tracking-wide">
                COOKIE NOTICE
              </p>
              <p className="text-xs md:text-base mb-1 md:mb-2 font-medium">
                We use cookies to enhance your experience and analyze site usage. By continuing to use our site, you consent to our use of cookies.
              </p>
              <p className="text-xs md:text-sm text-gray-300">
                Learn more in our{' '}
                <Link 
                  href="/legal/cookie-policy" 
                  className="text-yellow-400 hover:text-yellow-300 underline font-bold"
                >
                  COOKIE POLICY
                </Link>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row items-center gap-2 md:gap-4 flex-shrink-0 w-full lg:w-auto mt-2 lg:mt-0">
            <button
              onClick={handleDecline}
              className="flex-1 lg:flex-none px-2 py-1 md:px-3 md:py-2 bg-white text-black font-bold text-xs md:text-sm uppercase tracking-wide border-2 md:border-4 border-white hover:bg-gray-200 transition-colors"
            >
              DECLINE
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 lg:flex-none px-3 py-2 md:px-6 md:py-3 bg-yellow-400 text-black font-bold text-xs md:text-sm uppercase tracking-wide border-2 md:border-4 border-yellow-400 hover:bg-yellow-300 transition-colors"
            >
              ACCEPT ALL
            </button>
            <button
              onClick={handleClose}
              className="text-white hover:text-yellow-400 transition-colors p-1 md:p-2 border border-white md:border-2 hover:border-yellow-400"
              aria-label="Close cookie banner"
            >
              <X className="h-4 w-4 md:h-6 md:w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}