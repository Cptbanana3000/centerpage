'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
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
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have a question or need help? We're here to assist you with any inquiries about CenterPage.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Email Contact Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12">
            <div className="flex items-center mb-6">
              <Mail className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Email Support</h2>
            </div>
            <p className="text-gray-700 mb-6">
              For all inquiries, questions, or support requests, please contact us via email. Our team typically responds within 24 hours during business days.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a 
                href="mailto:support@getcenterpage.com" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                support@getcenterpage.com
              </a>
              <div className="text-sm text-gray-600">
                <Clock className="h-4 w-4 inline mr-1" />
                Response within 24 hours
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <div className="flex items-center mb-6">
              <MessageCircle className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Before reaching out, you might find the answer to your question in our comprehensive FAQ section. We've covered the most common questions about our service.
            </p>
            <Link href="/#faq" scroll={true}>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                View FAQ
              </Button>
            </Link>
          </div>

          {/* What We Can Help With */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Support</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Account access issues
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Analysis errors or failures
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Payment processing problems
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Feature questions
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Account & Billing</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Credit pack purchases
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Refund requests
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Account management
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Data privacy concerns
                </li>
              </ul>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Before You Contact Us</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Include in Your Email:</h4>
                <ul className="space-y-1">
                  <li>• Your email address</li>
                  <li>• Description of the issue</li>
                  <li>• Steps to reproduce (if applicable)</li>
                  <li>• Screenshots (if helpful)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Response Time:</h4>
                <ul className="space-y-1">
                  <li>• Business days: 24 hours</li>
                  <li>• Weekends: 48 hours</li>
                  <li>• Holidays: Extended response time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 