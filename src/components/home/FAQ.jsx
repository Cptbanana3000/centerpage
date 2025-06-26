'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

export function Faq() {
  return (
    <section className="bg-slate-50 py-24 sm:py-32">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
            Have questions? We've got answers. If you don't find what you're looking for, feel free to contact us.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto">
           <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium text-left text-gray-900 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
          ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
}
