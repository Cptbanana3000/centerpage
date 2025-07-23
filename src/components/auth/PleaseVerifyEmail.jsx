'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';

export function PleaseVerifyEmail() {
  const { user, resendVerificationEmail, logOut, refreshUser } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

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
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          setMessage('Email verification confirmed! Redirecting...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        } else {
          setMessage('Email not yet verified. Please check your inbox and click the verification link.');
        }
      } else {
        setError('No user found. Please try logging in again.');
      }
    } catch (err) {
      setError('Failed to check verification status. Please try again.');
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mb-8">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-light text-black mb-4">
            Verify Your Email
          </h1>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            A verification link has been sent to <span className="font-medium text-black">{user?.email}</span>. 
            Please click the link to activate your account.
          </p>
        </div>

        {message && (
          <div className="text-sm text-gray-700 bg-gray-50 p-3 border border-gray-200 rounded">
            {message}
          </div>
        )}
        
        {error && (
          <div className="text-sm text-gray-700 bg-gray-50 p-3 border border-gray-300 rounded">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleCheckVerification}
            disabled={isChecking}
            className="w-full h-12 bg-black text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isChecking ? 'Checking...' : 'I\'ve Verified'}
          </Button>
          
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
            variant="outline"
            className="w-full h-12 border border-gray-300 bg-white text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isResending ? 'Sending...' : 'Resend Email'}
          </Button>
          
          <Button
            onClick={logOut}
            variant="ghost"
            className="w-full h-12 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Log Out
          </Button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Check your spam folder if you don't see the email.
        </p>
      </div>
    </div>
  );
}