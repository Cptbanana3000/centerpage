'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="bg-white">
      <main className="container mx-auto px-4 py-24 sm:py-32">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-gray-900">
            We help you <span className="bg-yellow-300 px-4">get it right</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            CenterPage was born from a simple, painful truth: a bad brand name can kill a great business. We&apos;ve seen it happen. We built CenterPage to stop it from happening to you. Our mission is to give every founder the power to build a strong, resonant, and legally sound brand from day one.
          </p>
        </div>

        {/* Our Philosophy */}
        <div className="max-w-5xl mx-auto mt-20 md:mt-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="md:col-span-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">The CenterPage Philosophy</h2>
            </div>
            <div className="md:col-span-2 space-y-8 text-gray-700 text-base md:text-lg">
              <p>
                Choosing a name shouldn&apos;t feel like a gamble. It should be a strategic decision, backed by data. We believe in moving past subjective &quot;what sounds good&quot; conversations and into objective, data-driven analysis.
              </p>
              <p>
                Our platform is built on three core principles:
              </p>
              <ul className="space-y-4 list-disc list-outside pl-5">
                <li>
                  <span className="font-semibold">Comprehensive Analysis:</span> We go beyond a simple domain check. We analyze your name against SEO landscapes and potential competitor conflicts to give you a 360-degree view.
                </li>
                <li>
                  <span className="font-semibold">Actionable Insights:</span> We don&apos;t just dump data on you. We provide clear scores, strategic recommendations, and competitive intelligence that you can actually use to make a decision.
                </li>
                <li>
                  <span className="font-semibold">Founder Focused:</span> We&apos;re built for the speed and constraints of early-stage ventures. Get the insights you need in minutes, not weeks, and avoid costly legal fees or rebranding disasters down the line.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto text-center mt-20 md:mt-32">
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Ready to build a brand that lasts?</h2>
           <p className="mt-4 text-lg text-gray-600">
            Stop guessing. Start analyzing.
           </p>
           <div className="mt-8">
            <Link href="/" passHref>
               <Button size="lg" className="h-16 px-10 text-xl font-semibold bg-gray-900 text-white hover:bg-gray-800 shrink-0 cursor-pointer">
                Analyze Your Brand
               </Button>
             </Link>
           </div>
        </div>
      </main>
    </div>
  );
}
