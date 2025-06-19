'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function PleaseVerifyEmail() {
  const { user, resendVerificationEmail, logOut, refreshUser } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    setMessage('');
    setError('');
    try {
      await resendVerificationEmail();
      setMessage('A new verification link has been sent to your email address.');
    } catch (err) {
      setError('Failed to resend verification email. Please try again in a moment.');
      console.error(err);
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    setMessage('');
    setError('');
    try {
      await refreshUser();
      if (user?.emailVerified) {
        setMessage('Email verification confirmed! Redirecting...');
      } else {
        setMessage('Email not yet verified. Please check your inbox and click the verification link.');
      }
    } catch (err) {
      setError('Failed to check verification status. Please try again.');
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md text-center bg-[#212121]/80 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
        <p className="text-gray-300 mb-6">
          We've sent a verification link to{' '}
          <strong className="text-purple-400">{user?.email}</strong>. Please
          click the link in the email to activate your account and access your dashboard.
        </p>

        {message && <p className="mb-4 text-sm text-green-400">{message}</p>}
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        
        <div className="flex flex-col space-y-3">
            <Button
              onClick={handleCheckVerification}
              disabled={isChecking}
              className="w-full h-12 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#212121] focus:ring-green-600 disabled:opacity-50"
            >
              {isChecking ? 'Checking...' : 'I\'ve Verified - Check Status'}
            </Button>
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
              className="w-full h-12 border-white/20 text-white hover:bg-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#212121] focus:ring-[#667eea] disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
            <Button
              variant="ghost"
              onClick={logOut}
              className="text-gray-400 hover:bg-white/10 hover:text-white"
            >
              Log Out
            </Button>
        </div>

        <p className="mt-6 text-xs text-gray-500">
            Can't find the email? Check your spam folder or promotions tab.
        </p>
      </div>
    </div>
  );
} 