'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { SignInDialog } from '@/components/auth/SignInDialog';
import { SignUpDialog } from '@/components/auth/SignUpDialog';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleScrollToPricing = (e) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#212121]/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">VeritoLab</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <SignInDialog>
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </SignInDialog>
            <SignUpDialog>
              <Button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:from-[#5a6fd6] hover:to-[#6a3f9e]">
                Get Started
              </Button>
            </SignUpDialog>
          </div>
        </div>
      </div>
    </nav>
  );
} 