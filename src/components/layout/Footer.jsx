import React from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Mail } from 'lucide-react';

// Make sure you have Font Awesome loaded in your project for the icons to appear.
// For example, in your layout.js or _app.js: import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  const socialLinks = [
    { href: 'https://twitter.com/centerpage', icon: Twitter },
    { href: 'https://linkedin.com/company/centerpage', icon: Linkedin },
    { href: 'mailto:support@centerpage.com', icon: Mail },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Section: Logo, Description, and Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Column 1: Logo and Socials */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-3xl font-black text-gray-900">
              CenterPage
            </Link>
            <p className="mt-4 max-w-xs leading-relaxed">
              Empowering entrepreneurs with comprehensive brand name analysis and domain insights.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 border border-transparent rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all duration-300"
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 & 3: Link columns */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/#Features" className="hover:text-gray-900 transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
                <li><Link href="/#whyChooseUs" className="hover:text-gray-900 transition-colors">Why Us?</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
                {/* TODO: Create these pages and uncomment the links */}
                {/* <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link></li> */}
                {/* <li><Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link></li> */}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-3">
                {/* TODO: Create these pages and uncomment the links */}
                {/* <li><Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link></li> */}
                {/* <li><Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li> */}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm">
          <p>
            © {new Date().getFullYear()} CenterPage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
