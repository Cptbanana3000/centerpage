'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

export function Hero() {
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const dropdownRef = useRef(null);
  const canvasRef = useRef(null); // Ref for the particle canvas
  const router = useRouter();
  const { user } = useAuth();

  const categories = [
    { value: 'tech & saas', label: 'Tech & SaaS', icon: 'monitor' },
    { value: 'e-commerce & retail', label: 'E-commerce & Retail', icon: 'shopping-cart' },
    { value: 'health & wellness', label: 'Health & Wellness', icon: 'heart' },
    { value: 'creative & design', label: 'Creative & Design', icon: 'palette' },
    { value: 'games & entertainment', label: 'Games & Entertainment', icon: 'gamepad' },
    { value: 'finance & fintech', label: 'Finance & Fintech', icon: 'dollar-sign' },
    { value: 'food & beverage', label: 'Food & Beverage', icon: 'utensils' },
    { value: 'travel & hospitality', label: 'Travel & Hospitality', icon: 'plane' },
    { value: 'education & e-learning', label: 'Education & E-learning', icon: 'book' },
    { value: 'professional services', label: 'Professional Services', icon: 'briefcase' }
  ];

  const getIcon = (iconName) => {
    const iconProps = "w-4 h-4 inline-block mr-2 flex-shrink-0";
    // SVG definitions remain the same as in the original file.
    switch (iconName) {
        case 'monitor': return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
        case 'shopping-cart': return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.35 2.65a1 1 0 00.7 1.7H19M7 13v4a2 2 0 002 2h2m3-6v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" /></svg>;
        case 'heart': return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
        case 'palette': return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" /></svg>;
        case 'gamepad': return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>;
        case 'dollar-sign': return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>;
        case 'utensils': return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 2v6c0 1.1.9 2 2 2a2 2 0 002-2V2M7 10v12M15 2v6c0 1.1.9 2 2 2a2 2 0 002-2V2M19 10v12" /></svg>;
        case 'plane': return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
        case 'book': return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
        case 'briefcase': return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>;
        default: return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
    }
  };
  
  // Effect for Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 100;

    const mouse = {
        x: null,
        y: null,
        radius: 150
    };

    const handleMouseMove = (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    };
    
    const handleMouseOut = () => {
        mouse.x = null;
        mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    class Particle {
        constructor(x, y, directionX, directionY, size, color){
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if(distance < mouse.radius + this.size){
                if(mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 3;
                if(mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
                if(mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 3;
                if(mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            // Use canvas dimensions instead of window dimensions
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * .4) - .2;
            let directionY = (Math.random() * .4) - .2;
            let color = 'rgba(100, 255, 218, 0.5)';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connect(){
        let opacityValue = 1;
        for(let a = 0; a < particlesArray.length; a++){
            for(let b = a; b < particlesArray.length; b++){
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if(distance < (canvas.width/7) * (canvas.height/7)){
                    opacityValue = 1 - (distance/20000);
                    ctx.strokeStyle = `rgba(100, 255, 218, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    let animationFrameId;
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        // Use canvas dimensions for clearing the rectangle
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    };
    
    window.addEventListener('resize', handleResize);
    
    init();
    animate();

    // Cleanup function
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseout', handleMouseOut);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
    }
  }, []); // End of Particle Animation useEffect

  // Effect for closing dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const handleCategorySelect = (categoryValue) => {
    setCategory(categoryValue);
    setIsDropdownOpen(false);
    setCategoryError(false);
  };

  const selectedCategory = categories.find(cat => cat.value === category);

  const handleAnalysis = async () => {
    setError(null);
    setCategoryError(false);

    if (!brandName.trim()) {
      setError('Please enter a brand name.');
      return;
    }

    if (!category) {
      setCategoryError(true);
      setError('Please select a category.');
      return;
    }

    setIsLoading(true);

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (user) {
        const token = await user.getIdToken();
        options.headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch('/api/pre-analysis-check', options);
      const data = await res.json();

      if (!res.ok || !data.hasStandardCredits || !data.isVerified) {
        if (!data.isAuthenticated) {
          toast.error("Authentication Required", { description: "Please sign up or log in to run an analysis." });
        } else if (!data.isVerified) {
          toast.error("Email Not Verified", { description: "Please check your inbox and verify your email to continue." });
        } else if (!data.hasStandardCredits) {
          toast.error("Insufficient Credits", { description: `You have ${data.credits.standardAnalyses} standard analysis credits. Please purchase a credit pack to continue.` });
        }
        setIsLoading(false);
        return;
      }
      
      router.push(`/analysis?brand=${encodeURIComponent(brandName.trim())}&category=${encodeURIComponent(category)}`);
    } catch (err) {
      console.error('Pre-analysis check error:', err);
      toast.error("An Error Occurred", { description: "Could not start analysis. Please try again later." });
      setIsLoading(false);
    }
  };

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full -z-10 bg-[#0a192f]"
      />
      <section className="relative content-wrapper min-h-screen flex items-center justify-center p-4 font-['Inter',_sans-serif] text-[#ccd6f6]">
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tighter">
            Avoid the Rebrand. <br />
            <span className="text-[#64ffda]">Nail it the first time.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto mt-6 text-lg text-[#8892b0] leading-relaxed">
            Instantly analyze domain availability, search competition, and run AI-powered deep scans on competitors—all in one place. Go from idea to validated brand, faster.
          </p>

          <div className="max-w-3xl mx-auto mt-12">
            <div 
              className={`grid grid-cols-1 md:grid-cols-12 gap-2 rounded-xl p-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] backdrop-blur-lg transition-all duration-300 focus-within:bg-[rgba(255,255,255,0.1)] focus-within:shadow-[0_0_0_2px_rgba(100,255,218,0.2)]`}
            >
              {/* Brand Name Input */}
              <div className="md:col-span-6">
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalysis()}
                  placeholder="e.g., 'Aether' or 'Zenith'"
                  className="w-full h-14 px-4 bg-transparent border-none rounded-lg text-white placeholder-[#8892b0] focus:outline-none text-base"
                  disabled={isLoading}
                />
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-3 relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full h-14 px-4 bg-transparent border-none rounded-lg text-white focus:outline-none cursor-pointer text-base flex items-center justify-between text-left ${categoryError ? 'ring-2 ring-red-500' : ''}`}
                >
                  <span className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis">
                    {selectedCategory ? (
                      <>
                        {getIcon(selectedCategory.icon)}
                        <span className="truncate">{selectedCategory.label}</span>
                      </>
                    ) : (
                      <span className="text-[#8892b0]">Select a category</span>
                    )}
                  </span>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a192f]/80 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in-20">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategorySelect(cat.value)}
                        className={`w-full px-4 py-3 text-left text-base hover:bg-[rgba(100,255,218,0.1)] transition-colors duration-150 flex items-center ${
                          category === cat.value ? 'text-[#64ffda]' : 'text-white'
                        }`}
                      >
                        {getIcon(cat.icon)}
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              <div className="md:col-span-3">
                <Button
                  onClick={handleAnalysis}
                  disabled={isLoading}
                  className="w-full h-14 px-6 bg-[#64ffda] text-[#0a192f] rounded-lg hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-base flex items-center justify-center cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#0a192f] border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <span>Analyze Brand</span>
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
