'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RefundPolicyPage() {
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
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-lg text-gray-600 mb-12">
            Last Updated: July 16, 2025
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
          <p className="text-lg text-gray-700 mb-8">
            Our goal at CenterPage is to provide a valuable service that helps you make confident decisions about your brand. We aim for our policies to be as clear and fair as possible.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Credit Pack Purchases</h2>
          <p className="text-gray-700 mb-4">
            We offer a 7-day money-back guarantee on all credit pack purchases, subject to the following condition:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className="mb-2">The refund request must be made within 7 days of the original purchase date.</li>
            <li className="mb-2">This guarantee applies only to completely unused credit packs. If any credits (either "Standard Analysis" or "Deep Scan") from the pack have been used, the purchase is no longer eligible for a refund.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Used Credits</h2>
          <p className="text-gray-700 mb-6">
            Once a credit is used to perform an analysis, the service is considered rendered and is non-refundable. This is because each analysis incurs real costs from our third-party service providers (such as OpenAI and Google).
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Refunds for Technical Failures</h2>
          <p className="text-gray-700 mb-6">
            We stand by the reliability of our service. In the rare event that an analysis fails to complete due to a technical error on our end, the credit used for that specific operation will be automatically refunded to your account balance. You will not be charged for a service that you did not receive.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">How to Request a Refund</h2>
          <p className="text-gray-700 mb-4">
            To request a refund for an unused credit pack within the 7-day window, please follow these steps:
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-700">
            <li className="mb-2">Contact our support team at <a href="mailto:support@getcenterpage.com" className="text-blue-600 hover:text-blue-800 underline">support@getcenterpage.com</a>.</li>
            <li className="mb-2">Include the email address associated with your CenterPage account and the date of your purchase.</li>
            <li className="mb-2">We will review your request and process the refund via our payment processor, Paddle, if the conditions are met.</li>
            <li className="mb-2">Please allow 5-10 business days for the refund to appear on your original payment method.</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Contact Us</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions about our Refund Policy, please don't hesitate to contact us at <a href="mailto:support@getcenterpage.com" className="text-blue-600 hover:text-blue-800 underline">support@centerpage.com</a>.
          </p>
        </div>
      </main>
    </div>
  );
} 