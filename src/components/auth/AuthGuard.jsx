'use client';

import { useAuth } from '@/contexts/AuthContext';
import { PleaseVerifyEmail } from './PleaseVerifyEmail';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
      </div>
    );
  }

  if (user) {
    if (user.emailVerified) {
      return <>{children}</>;
    } else {
      return <PleaseVerifyEmail />;
    }
  }

  // If no user and not loading, we'll show a loader while redirecting.
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
    </div>
  );
} 