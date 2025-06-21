'use client';

import { useState } from 'react';

// Make sure you have Font Awesome loaded in your project for the icons to appear.
// For example, in your layout.js or _app.js: import '@fortawesome/fontawesome-free/css/all.min.css';

const faqData = [
  {
    question: 'Is this a one-time purchase or a subscription?',
    answer: 'This is a one-time purchase. You buy a credit pack, and the credits are yours to use whenever you need them. There are no recurring monthly fees, no hidden charges, and no subscriptions to cancel. We believe in a simple, project-based model that aligns with your needs.',
  },
  {
    question: 'Do my credits expire?',
    answer: 'Never. Your analysis credits are yours forever. Whether you use them all in one day for a big project or over the course of a year, they will be waiting in your account.',
  },
  {
    question: 'What\'s the difference between a "Standard Analysis" and a "Deep Scan Report"?',
    answer: 'A Standard Analysis is the initial report you get when you search for a name. It includes domain availability, an AI analysis of the Google search results, and scores for competition and SEO difficulty. A Deep Scan Report is the full "Strategic Battle Plan" you get when you choose to analyze a specific competitor. It involves a live scrape of their website and provides a much deeper, more detailed intelligence report.',
  },
  {
    question: 'What if I run out of credits?',
    answer: 'You can purchase another pack at any time from your dashboard. Your new credits will simply be added to your existing balance. Many of our agency users buy multiple packs as needed.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We partner with Stripe, a globally trusted payment provider, to securely process payments. We accept all major credit and debit cards, as well as Apple Pay and Google Pay.',
  },
];

const FaqItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-6 px-2"
      >
        <h3 className="text-lg md:text-xl font-medium text-[#ccd6f6]">{question}</h3>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
           <i className="fas fa-chevron-down text-[#64ffda]"></i>
        </span>
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="pb-6 px-2 text-[#8892b0] leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#0a192f] py-24 sm:py-32 font-['Inter',_sans-serif]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] backdrop-blur-lg rounded-xl p-4 sm:p-8">
          {faqData.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
