'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CookiePolicyPage() {
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
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-600 mb-12">
            Last Updated: July 16, 2025
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">What Are Cookies?</h2>
          <p className="text-gray-700 mb-6">
            As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored; however, this may downgrade or 'break' certain elements of the site's functionality.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">How We Use Cookies</h2>
          <p className="text-gray-700 mb-6">
            We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not, in case they are used to provide a service that you use.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Disabling Cookies</h2>
          <p className="text-gray-700 mb-6">
            You can prevent the setting of cookies by adjusting the settings on your browser (see your browser's "Help" section for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore, it is recommended that you do not disable cookies.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">The Cookies We Set</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Account related cookies</h3>
          <p className="text-gray-700 mb-6">
            If you create an account with us, then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out; however, in some cases, they may remain afterward to remember your site preferences when logged out. We use Firebase Authentication for this purpose.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Login related cookies</h3>
          <p className="text-gray-700 mb-6">
            We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Orders processing related cookies</h3>
          <p className="text-gray-700 mb-6">
            This site offers e-commerce or payment facilities, and some cookies are essential to ensure that your order is remembered between pages so that we can process it properly. Our payment provider, Paddle, uses cookies to securely manage the checkout process.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Third-Party Cookies</h2>
          <p className="text-gray-700 mb-4">
            In some special cases, we also use cookies provided by trusted third parties. The following section details which third-party cookies you might encounter through this site.
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className="mb-2">
              <strong>Firebase (Google):</strong> We use Firebase for core functionalities like user authentication and database services. Firebase may set cookies to manage user sessions securely.
            </li>
            <li className="mb-2">
              <strong>Paddle:</strong> When you purchase a credit pack, our payment processor, Paddle, will set cookies to securely process your transaction and prevent fraud.
            </li>
            <li className="mb-2">
              <strong>Usage Analytics:</strong> We collect anonymous data about how users interact with our site to help us improve the service. While we currently use our own internal analytics, we may use services like Google Analytics in the future. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">More Information</h2>
          <p className="text-gray-700 mb-4">
            Hopefully, that has clarified things for you. As was previously mentioned, if there is something that you aren't sure whether you need or not, it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
          </p>
          <p className="text-gray-700 mb-6">
            If you are still looking for more information, you can contact us through our preferred contact method:
          </p>
          <p className="text-gray-700 mb-6">
            <strong>Email:</strong> <a href="mailto:support@getcenterpage.com" className="text-blue-600 hover:text-blue-800 underline">support@getcenterpage.com</a>
          </p>
        </div>
      </main>
    </div>
  );
} 