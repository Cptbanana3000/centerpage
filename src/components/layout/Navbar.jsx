'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { SignInDialog } from '@/components/auth/SignInDialog';
import { SignUpDialog } from '@/components/auth/SignUpDialog';
import { Button } from '@/components/ui/button';
import { CreditDisplay } from '@/components/ui/CreditDisplay';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const { user, logOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await logOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const AuthButtons = ({ mobile = false }) => (
    <>
      <SignInDialog>
        <Button
          variant="ghost"
          className={`${
            mobile ? 'w-full justify-start text-sm' : 'text-sm lg:text-base'
          } text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer`}
          onClick={mobile ? handleMobileClose : undefined}
        >
          Sign In
        </Button>
      </SignInDialog>
      <SignUpDialog>
        <Button
          className={`${
            mobile ? 'w-full text-sm' : 'text-sm lg:text-base'
          } bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:from-[#5a6fd6] hover:to-[#6a3f9e] cursor-pointer`}
          onClick={mobile ? handleMobileClose : undefined}
        >
          Get Started
        </Button>
      </SignUpDialog>
    </>
  );

  const NavLinks = ({ mobile = false }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${
            mobile ? 'block py-2 text-base' : 'text-sm lg:text-base'
          } text-gray-300 hover:text-white transition-colors`}
          onClick={mobile ? handleMobileClose : undefined}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#212121]/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-white">VeritoLab</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <NavLinks />
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {user ? (
              <>
                <div className="hidden sm:block">
                  <CreditDisplay variant="compact" showRefill={false} />
                </div>
                <Link
                  href="/dashboard"
                  className="hidden sm:block text-sm lg:text-base text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden sm:flex text-sm lg:text-base text-gray-300 hover:text-white cursor-pointer"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
                <AuthButtons />
              </div>
            )}

            {/* Mobile menu button */}
            <div className="sm:hidden lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white hover:bg-white/10 p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>

            {/* Tablet menu button (between sm and lg) */}
            <div className="hidden sm:block lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white hover:bg-white/10 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#212121]/95 backdrop-blur-lg border-t border-white/10">
            <div className="px-3 sm:px-4 py-4 space-y-3 sm:space-y-4">
              <div className="space-y-1">
                <NavLinks mobile />
              </div>

              {user ? (
                <>
                  <div className="border-t border-white/10 pt-3 sm:pt-4 space-y-3">
                    {/* Show credits on mobile */}
                    <div className="sm:hidden">
                      <CreditDisplay variant="compact" showRefill={false} />
                    </div>
                    
                    <Link
                      href="/dashboard"
                      className="block py-2 text-base text-gray-300 hover:text-white transition-colors"
                      onClick={handleMobileClose}
                    >
                      Dashboard
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start text-base text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer py-2"
                    >
                      Sign Out
                    </Button>
                    <div className="flex items-center space-x-3 pt-2 pb-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-sm sm:text-base font-bold text-white">
                        {user?.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-gray-300 text-sm sm:text-base truncate flex-1">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-t border-white/10 pt-3 sm:pt-4 space-y-3">
                  <AuthButtons mobile />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}