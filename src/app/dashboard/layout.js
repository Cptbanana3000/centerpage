'use client';

import { AuthGuard } from "@/components/auth/AuthGuard";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';

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
          ? 'text-white font-bold'
          : 'text-[#8892b0] hover:text-[#ccd6f6]'
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
      <div className="min-h-screen bg-[#0a192f]">
        {/* Top Navigation Bar */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a192f]/80 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Side: Logo & Nav Links */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-black text-white">
                          VeritoLab
                        </Link>
                        <nav className="hidden lg:flex items-center gap-4">
                            <NavLink href="/dashboard">Overview</NavLink>
                            {/* <NavLink href="/dashboard/settings">Settings</NavLink> */}
                        </nav>
                    </div>

                    {/* Right Side: User Profile Menu */}
                    <div className="relative" ref={profileMenuRef}>
                        <Button
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#64ffda] to-[#8892b0]/50 flex items-center justify-center font-bold text-white text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a192f] focus:ring-[#64ffda]"
                        >
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                        </Button>

                        {/* Profile Dropdown */}
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-64 origin-top-right bg-[rgba(10,25,47,0.95)] backdrop-blur-xl border border-white/10 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in-0 zoom-in-95">
                                <div className="p-4 border-b border-white/10">
                                    <p className="text-sm text-[#8892b0]">Signed in as</p>
                                    <p className="font-medium text-[#ccd6f6] truncate">{user?.email}</p>
                                </div>
                                <div className="py-2">
                                     <Link href="/dashboard" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-[#8892b0] hover:bg-white/5 hover:text-white">Overview</Link>
                                     <Link href="/dashboard/settings" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-[#8892b0] hover:bg-white/5 hover:text-white">Settings</Link>
                                </div>
                                <div className="py-2 border-t border-white/10">
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
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
