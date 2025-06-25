'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { SignInDialog } from '@/components/auth/SignInDialog';
import { SignUpDialog } from '@/components/auth/SignUpDialog';
import { Button } from '@/components/ui/button';
import { CreditDisplay } from '@/components/ui/CreditDisplay';

const navLinks = [
  { href: '/#Features', label: 'Features' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#whyChooseUs', label: 'Why Us' },
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
    setIsMobileMenuOpen(false); // Close menu on sign out
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const AuthButtons = ({ mobile = false }) => (
    <div className={`flex items-center gap-2 ${mobile ? 'flex-col w-full' : ''}`}>
      <SignInDialog>
        <Button
          variant="ghost"
          className={`w-full text-gray-600 hover:text-gray-900 ${mobile ? 'justify-start p-2' : 'p-2'}`}
          onClick={mobile ? handleMobileClose : undefined}
        >
          Sign In
        </Button>
      </SignInDialog>
      <SignUpDialog>
        <Button
          className={`w-full bg-gray-900 text-white hover:bg-gray-800 font-bold ${mobile ? 'p-2' : 'py-2 px-4'}`}
          onClick={mobile ? handleMobileClose : undefined}
        >
          Get Started
        </Button>
      </SignUpDialog>
    </div>
  );

  const NavLinks = ({ mobile = false }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 transition-colors ${mobile ? 'block' : ''}`}
          onClick={mobile ? handleMobileClose : undefined}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="relative w-full z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-black text-gray-900">CenterPage</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-4">
            <NavLinks />
          </div>

          {/* Right side: Auth buttons for desktop */}
          <div className="hidden lg:flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <CreditDisplay variant="compact" showRefill={false} />
                <Link href="/dashboard" className="px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <Button variant="ghost" onClick={handleSignOut} className="text-gray-600 hover:text-gray-900">
                  Sign Out
                </Button>
              </div>
            ) : (
              <AuthButtons />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white absolute top-full left-0 w-full border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <NavLinks mobile />
            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="font-medium text-gray-900">My Account</span>
                     <CreditDisplay variant="compact" showRefill={false} />
                  </div>
                  <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 transition-colors" onClick={handleMobileClose}>
                    Dashboard
                  </Link>
                   <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <AuthButtons mobile />
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
