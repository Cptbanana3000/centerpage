import React from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Mail, Shield, FileText, CreditCard, Cookie } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { href: 'https://twitter.com/centerpage', icon: Twitter, label: 'Twitter' },
    { href: 'https://linkedin.com/company/centerpage', icon: Linkedin, label: 'LinkedIn' },
    { href: 'mailto:support@centerpage.com', icon: Mail, label: 'Email' },
  ];

  const productLinks = [
    { href: '/#Features', label: 'Features' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#whyChooseUs', label: 'Why Us?' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const companyLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    // { href: '/blog', label: 'Blog' },
    // { href: '/support', label: 'Support' },
  ];

  const legalLinks = [
    { href: '/legal/privacy-policy', label: 'Privacy Policy', icon: Shield },
    { href: '/legal/terms-of-service', label: 'Terms of Service', icon: FileText },
    { href: '/legal/refund-policy', label: 'Refund Policy', icon: CreditCard },
    { href: '/legal/cookie-policy', label: 'Cookie Policy', icon: Cookie },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Section: Logo, Description, and Links */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Logo and Socials */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="CenterPage" className="h-20 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs leading-relaxed text-gray-600">
              Empowering entrepreneurs with comprehensive brand name analysis and domain insights. Make confident branding decisions with data-driven intelligence.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 border border-transparent rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all duration-300"
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Product Links */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="hover:text-gray-900 transition-colors duration-200 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="hover:text-gray-900 transition-colors duration-200 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal Links */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="flex items-center hover:text-gray-900 transition-colors duration-200 hover:underline"
                  >
                    {link.icon && <link.icon className="h-4 w-4 mr-2 text-gray-400" />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} CenterPage. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>Made with ❤️ for entrepreneurs</span>
              <span>•</span>
              <span>Version 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
