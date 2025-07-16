'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 mb-12">
            Last Updated: July 16, 2025
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">1. Introduction</h2>
          <p className="text-gray-700 mb-6">
            Welcome to CenterPage ("we", "us", "our"). We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>
          <p className="text-gray-700 mb-6">
            By using our service, you agree to the collection and use of information in accordance with this policy.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">2. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We collect several different types of information for various purposes to provide and improve our service to you.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Personal Data:</strong> While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This includes:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className="mb-2">Email address</li>
            <li className="mb-2">Password (which is hashed and never stored in plain text)</li>
            <li className="mb-2">Payment information (processed by our payment partner)</li>
          </ul>
          <p className="text-gray-700 mb-4">
            <strong>Analysis & Usage Data:</strong> We collect and store information related to your use of our service to provide you with your history and to improve our offerings. This includes:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className="mb-2">The brand names you analyze.</li>
            <li className="mb-2">The results and reports generated from your analyses.</li>
            <li className="mb-2">General usage data, such as your IP address, browser type, and pages visited.</li>
          </ul>
          <p className="text-gray-700 mb-6">
            <strong>Financial Data:</strong> All payments are processed securely by our third-party payment processor, Paddle. We do not collect or store any credit card information on our servers.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">3. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the collected data for various purposes:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className="mb-2">To create and manage your account.</li>
            <li className="mb-2">To process your transactions for credit packs.</li>
            <li className="mb-2">To provide, maintain, and improve our analysis services.</li>
            <li className="mb-2">To display your analysis history in your dashboard.</li>
            <li className="mb-2">To monitor usage and trends to enhance security and user experience.</li>
            <li className="mb-2">To communicate with you about your account or important service updates.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">4. Disclosure of Your Information & Data Processing</h2>
          <p className="text-gray-700 mb-4">
            Your privacy is critical to us. We do not sell your data. We may share your information with third-party service providers only in the ways that are described in this policy.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Core Service Providers:</strong>
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className="mb-2">
              <strong>Firebase (Google):</strong> We use Firebase for user authentication, database hosting (Firestore), and secure file storage.
            </li>
            <li className="mb-2">
              <strong>Paddle:</strong> Handles all payment processing for credit pack purchases.
            </li>
            <li className="mb-2">
              <strong>Vercel:</strong> Hosts our website and application.
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            <strong>Analysis Sub-Processors:</strong> To perform our analysis, we send non-personal data to the following services:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className="mb-2">
              <strong>OpenAI:</strong> We send the brand name you are analyzing and publicly available data about competitors to the OpenAI API to generate AI-powered insights. Your personal user information is never sent with these requests.
            </li>
            <li className="mb-2">
              <strong>Google Custom Search & GoDaddy APIs:</strong> We use these services to gather public information about domain availability and search engine results.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">5. Your Data, Your Ideas</h2>
          <p className="text-gray-700 mb-6">
            We treat the brand names and ideas you analyze as your confidential information. Your analysis history is private to your account. We will never share your specific brand ideas or analysis results with other users or third parties, except as required by law.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">6. Security of Your Information</h2>
          <p className="text-gray-700 mb-6">
            We use administrative, technical, and physical security measures, including data encryption and secure hosting with Firebase, to help protect your personal information. While we have taken reasonable steps to secure your data, please be aware that no security measures are perfect or impenetrable.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">7. Children's Privacy</h2>
          <p className="text-gray-700 mb-6">
            Our service is not intended for use by anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">8. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 mb-6">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">9. Contact Us</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions or comments about this Privacy Policy, please contact us at: <a href="mailto:support@getcenterpage.com" className="text-blue-600 hover:text-blue-800 underline">support@getcenterpage.com</a>
          </p>
        </div>
      </main>
    </div>
  );
} 