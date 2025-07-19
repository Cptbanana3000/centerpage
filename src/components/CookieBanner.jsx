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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white border-t-8 border-yellow-400 shadow-2xl">
      <div className="w-full px-8 py-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          {/* Content */}
          <div className="flex items-start gap-4 flex-1">
            <Cookie className="h-8 w-8 text-yellow-400 mt-1 flex-shrink-0" />
            <div className="text-white">
              <p className="text-lg font-bold mb-3 uppercase tracking-wide">
                COOKIE NOTICE
              </p>
              <p className="text-base mb-2 font-medium">
                We use cookies to enhance your experience and analyze site usage. By continuing to use our site, you consent to our use of cookies.
              </p>
              <p className="text-sm text-gray-300">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-shrink-0 min-w-fit">
            <button
              onClick={handleDecline}
              className="px-6 py-3 bg-white text-black font-bold text-sm uppercase tracking-wide border-4 border-white hover:bg-gray-200 transition-colors"
            >
              DECLINE
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-3 bg-yellow-400 text-black font-bold text-sm uppercase tracking-wide border-4 border-yellow-400 hover:bg-yellow-300 transition-colors"
            >
              ACCEPT ALL
            </button>
            <button
              onClick={handleClose}
              className="text-white hover:text-yellow-400 transition-colors p-2 border-2 border-white hover:border-yellow-400"
              aria-label="Close cookie banner"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}