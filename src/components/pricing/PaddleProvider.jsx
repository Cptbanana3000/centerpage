'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// You can find your Client-side token in your Paddle Dashboard
// under Developer Tools > Authentication
const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

const initializePaddle = () => {
  if (typeof window.Paddle !== 'undefined' && clientToken) {
    if (process.env.NEXT_PUBLIC_PADDLE_ENV === 'sandbox') {
      window.Paddle.Environment.set('sandbox');
    }
    window.Paddle.Initialize({
      token: clientToken,
      // Other configuration can go here
    });
  }
};

export const PaddleProvider = ({ children }) => {
  useEffect(() => {
    // This effect handles cases where the component mounts after the script has already been loaded.
    initializePaddle();
  }, []);

  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        onLoad={initializePaddle}
        strategy="lazyOnload"
      />
      {children}
    </>
  );
}; 