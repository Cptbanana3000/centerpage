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
            CenterPage helps you <span className="bg-yellow-300 px-4">get it right</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            CenterPage was born from a simple, painful truth: a bad brand name can kill a great business. The platform was built to stop this from happening to founders. The mission is to give every entrepreneur the power to build a strong, resonant, and legally sound brand from day one.
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
                Choosing a name shouldn&apos;t feel like a gamble. It should be a strategic decision, backed by data. CenterPage moves past subjective &quot;what sounds good&quot; conversations and into objective, data-driven analysis.
              </p>
              <p>
                The platform is built on three core principles:
              </p>
              <ul className="space-y-4 list-disc list-outside pl-5">
                <li>
                  <span className="font-semibold">Comprehensive Analysis:</span> The platform goes beyond a simple domain check. It analyzes brand names against SEO landscapes and potential competitor conflicts to provide a 360-degree view.
                </li>
                <li>
                  <span className="font-semibold">Actionable Insights:</span> CenterPage doesn&apos;t just dump data on users. It provides clear scores, strategic recommendations, and competitive intelligence that can actually be used to make informed decisions.
                </li>
                <li>
                  <span className="font-semibold">Founder Focused:</span> The platform is built for the speed and constraints of early-stage ventures. Founders get the insights they need in minutes, not weeks, and avoid costly legal fees or rebranding disasters down the line.
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
