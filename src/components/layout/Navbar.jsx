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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            {/* {user && (
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            )} */}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              // Logged in user navigation
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  Sign Out
                </Button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-sm font-bold text-white">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
              </>
            ) : (
              // Guest user navigation
              <>
                <SignInDialog>
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer">
                    Sign In
                  </Button>
                </SignInDialog>
                <SignUpDialog>
                  <Button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:from-[#5a6fd6] hover:to-[#6a3f9e] cursor-pointer">
                    Get Started
                  </Button>
                </SignUpDialog>
              </>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#212121]/95 backdrop-blur-lg border-t border-white/10">
            <div className="px-4 py-4 space-y-4">
              <Link 
                href="/#features" 
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/#pricing" 
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/about" 
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="block text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    Sign Out
                  </Button>
                  <div className="flex items-center space-x-3 pt-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-sm font-bold text-white">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-gray-300 text-sm">{user?.email}</span>
                  </div>
                </>
              ) : (
                <div className="space-y-3 pt-2">
                  <SignInDialog>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </SignInDialog>
                  <SignUpDialog>
                    <Button 
                      className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:from-[#5a6fd6] hover:to-[#6a3f9e]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Button>
                  </SignUpDialog>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 