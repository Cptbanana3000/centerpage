import React from 'react';
import Link from 'next/link';

// Make sure you have Font Awesome loaded in your project for the icons to appear.
// For example, in your layout.js or _app.js: import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  const socialLinks = [
    { href: 'https://twitter.com/veritolab', icon: 'fab fa-twitter' },
    { href: 'https://linkedin.com/company/veritolab', icon: 'fab fa-linkedin-in' },
    { href: 'mailto:support@veritolab.com', icon: 'fas fa-envelope' },
  ];

  return (
    <footer className="bg-[#0a192f] border-t border-white/10 text-[#8892b0] font-['Inter',_sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Section: Logo, Description, and Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Column 1: Logo and Socials */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-3xl font-black text-white">
              VeritoLab
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
                  className="w-10 h-10 bg-[rgba(255,255,255,0.05)] border border-transparent rounded-full flex items-center justify-center text-[#8892b0] hover:text-[#64ffda] hover:border-[#64ffda]/50 transition-all duration-300"
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 & 3: Link columns */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-base font-semibold text-[#ccd6f6] mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/#Features" className="hover:text-[#64ffda] transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-[#64ffda] transition-colors">Pricing</Link></li>
                <li><Link href="/#whyChooseUs" className="hover:text-[#64ffda] transition-colors">Why Us?</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#ccd6f6] mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="hover:text-[#64ffda] transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-[#64ffda] transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-[#64ffda] transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#ccd6f6] mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/terms" className="hover:text-[#64ffda] transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-[#64ffda] transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm">
          <p>
            © {new Date().getFullYear()} VeritoLab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
