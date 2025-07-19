import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { AnalysisHistoryProvider } from '@/contexts/AnalysisHistoryContext';
import { PaddleProvider } from '@/components/pricing/PaddleProvider';
// import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner"
import CookieBanner from "@/components/CookieBanner";


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CenterPage',
  description: 'The new standard for brand validation',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    other: [
      { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head />
      <body className={inter.className}>
        <AuthProvider>
          <AnalysisHistoryProvider>
            <PaddleProvider>
              {/* <Navbar /> */}
              {children}
              <Toaster />
              <Footer />
              <CookieBanner />
            </PaddleProvider>
          </AnalysisHistoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
