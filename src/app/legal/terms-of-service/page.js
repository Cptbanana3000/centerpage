'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto px-4 py-24 sm:py-32">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 mb-12">
            Last Updated: July 16, 2025
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
          <p className="text-lg text-gray-700 mb-8">
            Welcome to CenterPage! These Terms of Service (&quot;Terms&quot;) govern your use of our website and the services we provide. By accessing or using our service, you agree to be bound by these Terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">1. Description of Service</h2>
          <p className="text-gray-700 mb-4">
            CenterPage (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides a brand name analysis tool that includes:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className="mb-2">
              <strong>Standard Analysis:</strong> An automated report that checks for domain availability and analyzes Google search results to provide scores for competition, SEO difficulty, and overall brand viability.
            </li>
            <li className="mb-2">
              <strong>Deep Scan Analysis:</strong> A more detailed, AI-powered analysis of specific competitors, providing strategic insights.
            </li>
          </ul>
          <p className="text-gray-700 mb-6">
            Our services are for informational purposes only and do not constitute legal advice.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">2. User Accounts</h2>
          <p className="text-gray-700 mb-4">
            To access most features of CenterPage, you must register for an account. You agree to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className="mb-2">Provide accurate and complete information.</li>
            <li className="mb-2">Keep your password confidential.</li>
            <li className="mb-2">Verify your email address to activate full account functionality.</li>
            <li className="mb-2">Be responsible for all activities that occur under your account.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">3. Purchases and Credits</h2>
          <p className="text-gray-700 mb-4">
            <strong>Credit System:</strong> Our services are purchased via &quot;Standard Analysis&quot; and &quot;Deep Scan&quot; credits, which are sold in one-time packs.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Payments:</strong> We use Paddle as our third-party payment processor. By making a purchase, you agree to Paddle&apos;s terms and policies. We do not store your credit card details.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>No Expiration:</strong> Purchased credits do not expire and will remain in your account until they are used.
          </p>
          <p className="text-gray-700 mb-6">
            <strong>Refunds:</strong> All purchases are final and non-refundable. If a service fails to render due to a technical error on our part, the credit used for that service will be automatically refunded to your account.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">4. Acceptable Use</h2>
          <p className="text-gray-700 mb-4">
            You agree not to misuse the CenterPage service. This includes, but is not limited to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className="mb-2">Using automated scripts or bots to access the service or perform analyses.</li>
            <li className="mb-2">Reselling or redistributing our analysis reports without our express written permission.</li>
            <li className="mb-2">Attempting to interfere with the proper functioning of our services.</li>
            <li className="mb-2">Using the service for any illegal or unauthorized purpose.</li>
          </ul>
          <p className="text-gray-700 mb-6">
            We have rate limits in place to ensure fair usage for all users.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">5. Disclaimer of Warranties</h2>
          <p className="text-gray-700 mb-6">
            The CenterPage service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties, express or implied, that the service will be uninterrupted, error-free, or completely accurate. The AI-powered analysis is a tool to guide your decision-making and is not a guarantee of future success or a substitute for professional legal or business advice.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">6. Limitation of Liability</h2>
          <p className="text-gray-700 mb-6">
            To the fullest extent permitted by law, CenterPage shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from your use of our service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">7. Changes to Terms</h2>
          <p className="text-gray-700 mb-6">
            We may modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the &quot;Last Updated&quot; date. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">8. Contact Us</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions about these Terms, please contact us at: <a href="mailto:support@getcenterpage.com" className="text-blue-600 hover:text-blue-800 underline">support@getcenterpage.com</a>
          </p>
        </div>
      </main>
    </div>
  );
} 