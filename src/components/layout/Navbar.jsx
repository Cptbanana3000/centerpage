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
  { href: '/#whyChooseUs', label: 'Why Us' }, // Added a link for the WhyChooseUs section
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

  // Reusable Auth Buttons with updated styling
  const AuthButtons = ({ mobile = false }) => (
    <div className={`flex items-center gap-2 ${mobile ? 'flex-col w-full' : ''}`}>
      <SignInDialog>
        <Button
          variant="ghost"
          className={`w-full text-[#8892b0] hover:text-[#ccd6f6] hover:bg-transparent ${mobile ? 'justify-start p-2' : 'p-2'}`}
          onClick={mobile ? handleMobileClose : undefined}
        >
          Sign In
        </Button>
      </SignInDialog>
      <SignUpDialog>
        <Button
          className={`w-full bg-[#64ffda] text-[#0a192f] hover:bg-white font-bold ${mobile ? 'p-2' : 'p-2'}`}
          onClick={mobile ? handleMobileClose : undefined}
        >
          Get Started
        </Button>
      </SignUpDialog>
    </div>
  );

  // Reusable Nav Links with updated styling
  const NavLinks = ({ mobile = false }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-3 py-2 rounded-md text-base font-medium text-[#8892b0] hover:text-[#ccd6f6] transition-colors ${mobile ? 'block' : ''}`}
          onClick={mobile ? handleMobileClose : undefined}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a192f]/80 backdrop-blur-lg border-b border-white/10 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-black text-white">VeritoLab</span>
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
                <Link href="/dashboard" className="px-3 py-2 rounded-md text-base font-medium text-[#8892b0] hover:text-[#ccd6f6] transition-colors">
                  Dashboard
                </Link>
                <Button variant="ghost" onClick={handleSignOut} className="text-[#8892b0] hover:text-[#ccd6f6] hover:bg-transparent">
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
              className="text-[#ccd6f6] hover:text-white hover:bg-white/10 p-2"
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
        <div className="lg:hidden bg-[#0a192f]/95 backdrop-blur-xl absolute top-full left-0 w-full border-t border-white/10 ">
          <div className="px-4 pt-2 pb-4 space-y-4 " >
            <NavLinks mobile />
            <div className="border-t border-white/20 pt-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="font-medium text-white">My Account</span>
                     <CreditDisplay variant="compact" showRefill={false} />
                  </div>
                  <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-[#8892b0] hover:text-[#ccd6f6] transition-colors" onClick={handleMobileClose}>
                    Dashboard
                  </Link>
                   <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start px-3 py-2 text-base font-medium text-[#8892b0] hover:text-[#ccd6f6] hover:bg-transparent">
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
