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
  title: {
    default: 'CenterPage - AI-Powered Brand Name Validation/viability checker & Analysis',
    template: '%s | CenterPage'
  },
  description: 'Validate and check if your brand name is viable with AI-powered analysis. Check domain availability, analyze competitors, get SEO insights, and make data-driven branding decisions. The new standard for brand validation.',
  keywords: ['brand validation', 'brand name analysis', 'domain availability', 'competitor analysis', 'SEO analysis', 'brand naming', 'AI brand analysis', 'startup branding'],
  authors: [{ name: 'CenterPage Team' }],
  creator: 'CenterPage',
  publisher: 'CenterPage',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.getcenterpage.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CenterPage - AI-Powered Brand Name Validation/viability checker & Analysis',
    description: 'Validate your brand name with AI-powered analysis. Check domain availability, analyze competitors, get SEO insights, and make data-driven branding decisions.',
    url: 'https://www.getcenterpage.com',
    siteName: 'CenterPage',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CenterPage - Brand Name Validation/viability checker & Analysis Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CenterPage - AI-Powered Brand Name Validation/viability checker & Analysis',
    description: 'Validate your brand name with AI-powered analysis. Check domain availability, analyze competitors, get SEO insights.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
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
