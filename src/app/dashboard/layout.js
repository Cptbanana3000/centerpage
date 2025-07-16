'use client';

import { AuthGuard } from "@/components/auth/AuthGuard";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';

import CreditDisplay from '@/components/ui/CreditDisplay';

// Make sure you have Font Awesome loaded for icons
// import '@fortawesome/fontawesome-free/css/all.min.css';

const NavLink = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-base font-medium transition-colors
        ${isActive
          ? 'text-gray-900 font-bold'
          : 'text-gray-500 hover:text-gray-900'
        }`}
    >
      {children}
    </Link>
  );
};

export default function DashboardLayout({ children }) {
  const { user, logOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Side: Logo & Nav Links */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
                                          <img src="/logo.png" alt="CenterPage Logo" className="h-20 w-auto" />
                {/* <span className="font-bold text-xl text-gray-800">CenterPage</span> */}
                        </Link>
                        
                    </div>

                    {/* Right Side: User Profile Menu */}
                    <div className="relative" ref={profileMenuRef}>
                        <Button
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900"
                        >
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                        </Button>

                        {/* Profile Dropdown */}
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-64 origin-top-right bg-white border border-gray-200 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in-0 zoom-in-95">
                                <div className="p-4 border-b border-gray-200">
                                    <p className="text-sm text-gray-500">Signed in as</p>
                                    <p className="font-medium text-gray-800 truncate">{user?.email}</p>
                                </div>
                                <div className="py-2">
                                     {/* <Link href="/dashboard" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">Overview</Link> */}
                                     <Link href="/dashboard/settings" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">Settings</Link>
                                </div>
                                <div className="py-2 border-t border-gray-200">
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>

        {/* Main Content */}
        {/* pt-16 ensures content is not hidden behind the fixed header */}
        <main className="pt-16">
           {children}
        </main>
      </div>
    </AuthGuard>
  );
}
