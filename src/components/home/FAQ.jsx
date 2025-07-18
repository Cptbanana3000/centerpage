'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

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
    answer: 'We partner with Paddle, a globally trusted payment provider, to securely process payments. We accept all major credit and debit cards, as well as Apple Pay and Google Pay.',
  },
  {
    question: 'How do I get started?',
    answer: 'Simply sign up for an account, purchase a credit pack, and start analyzing names. You can also check out our "How to" guide for a quick overview.',
  },
  {
    question: 'Can i purchase domains through CenterPage?',
    answer: 'No, we do not sell domains at the moment but we are working on it and soon you will be able to purchase domains through CenterPage.',
  },
  {
    question: 'Can i purchase deepscan credits as a standalone product?',
    answer: 'No, we do not sell deepscan credits as a standalone product ',
  },
  {
    question: 'how accurate are the scores and how are they calculated?',
    answer: 'Scores are based on real-time data and AI analysis to give you the most accurate assessment possible.Overall Score (0-100): We combine three key factors: 1. Domain availability (40%) - Can you get the .com and good alternatives?. 2. Market competition (40%) - How crowded is your space? 3.SEO difficulty (20%) - How hard will it be to rank in search?, Real-time data - We check domain availability and Google results live,AI-powered analysis - Uses advanced AI to understand market context,Industry-specific - Considers your specific business category,Multiple data sources - Combines domain checks, search results, and competitor analysis',
  },
  {
    question: 'Is tech stack identification a standalone service?',
    answer: 'No,it is included in the deepscan itself as part of the premium plan'
  },
  {
    question: 'Why did my brand name get a low score even though the domain is available?',
    answer: 'Our analysis goes much deeper than a simple domain check. A low score, despite domain availability, is often a warning sign of future problems. It typically happens for one of two reasons: 1) High Competition: The name is similar to major, established brands, making it very difficult and expensive to rank in search results. 2) Brand Confusion: The name is a common word or is phonetically similar to other brands, which can confuse customers and even lead to legal trademark issues down the road. Our goal is to save you from these costly mistakes, helping you choose a name that is not just available, but strong and defensible.',
  },
  {
    question: 'Is my data and my brand ideas safe and private?',
    answer: 'Absolutely. Your privacy is paramount. We do not share your brand analysis data with anyone. All analyses are stored securely in your private account history. We use industry-standard encryption and security practices to protect your data.',
  },
  {
    question: "I'm unable to buy a credit pack",
    answer: 'If you are unable to purchase a credit pack, please check if you are logged in. And please make sure to verify your email address. If you are still unable to purchase a credit pack, please contact us at support@getcenterpage.com'
  },
  {
    question: 'My Payment was successful but I did not receive the credits',
    answer: 'Sometimes it just takes a few minutes for the credits to appear in your account. If you have not received the credits after 10 minutes, please contact us at support@getcenterpage.com ,Mail use the screenshot of the payment and the email address you used to purchase the credits.'
  },
  {
    question: 'Do you have a refund policy?',
    answer: (
      <>
        Yes we have a 7 days refund policy. Please refer to our{' '}
        <Link href="/legal/refund-policy" className="text-blue-600 hover:text-blue-800 underline font-medium">
          Refund Policy
        </Link>{' '}
        for more details.
      </>
    )
  }

  
  
  
];

export function Faq() {
  return (
    <section id="faq" className="bg-slate-50 py-24 sm:py-32">
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
