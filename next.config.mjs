/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/__/auth/:path*',
          destination: 'https://veritolab-990d9.firebaseapp.com/__/auth/:path*',
        },
      ];
    },
  };
  
  export default nextConfig;