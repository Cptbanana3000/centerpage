import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { AnalysisHistoryProvider } from '@/contexts/AnalysisHistoryContext';
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'VeritoLab - Brand Name Viability Analysis',
  description: 'Analyze your brand name\'s viability with comprehensive domain, competition, and SEO analysis.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <AnalysisHistoryProvider>
            {children}
          </AnalysisHistoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
