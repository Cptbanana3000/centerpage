'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { CATEGORIES } from '@/app/analysis/utils/categories';

export function Hero() {
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleAnalysis = async () => {
    if (!brandName.trim()) {
      toast.error("Brand Name Required", {
        description: "Please enter a brand name to analyze.",
      });
      return;
    }
    if (!category) {
      toast.error("Category Required", {
        description: "Please select a category for a more accurate analysis.",
      });
      return;
    }

    setIsLoading(true);
    router.push(`/analysis?brand=${encodeURIComponent(brandName.trim())}&category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-white">
      {/* Blurred Background Image for mobile */}
      <div className="absolute inset-0 lg:hidden z-0">
        <Image
          src="/hero7.jpg"
          alt="A team collaborating on a new brand"
          fill
          className="object-cover opacity-10 blur-xl"
        />
      </div>

      <div className="relative container mx-auto px-4 py-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left side: Text and Form */}
          <div className="flex flex-col text-left z-10">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-gray-900 leading-none">
              Avoid the <br className="hidden md:block" /> Rebrand.
            </h1>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-gray-800 leading-none mt-2">
              <span className="bg-yellow-300 px-4">
                Nail it the first time.
              </span>
            </h2>
            
            <div className="mt-12 max-w-xl">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="enter your brand..."
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="h-16 flex-grow text-xl text-gray-900 border-gray-400 focus:border-gray-900 focus:ring-gray-900"
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
                />
                <Button
                  onClick={handleAnalysis}
                  disabled={isLoading}
                  className="h-16 px-10 text-xl font-semibold bg-gray-900 text-white hover:bg-gray-800 shrink-0"
                  style={{ borderRadius: '0.5rem' }}
                >
                  {isLoading ? '...' : 'Search'}
                </Button>
              </div>
              <div className="mt-4">
                 <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 w-auto px-4 text-base bg-white border-gray-400 text-gray-500">
                    <SelectValue placeholder="select a category" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" className="bg-white text-gray-900">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Right side: Image - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:relative lg:flex lg:items-center lg:justify-center">
             <div className="lg:-mr-32 transform-gpu rotate-12">
              <Image
                src="/hero7.jpg" 
                alt="A team collaborating on a new brand"
                width={700}
                height={500}
                className="rounded-3xl object-cover shadow-2xl"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
