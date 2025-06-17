'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SignUpDialog } from '@/components/auth/SignUpDialog';

export function Hero() {
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState(''); // No default category - starts empty
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categoryError, setCategoryError] = useState(false); // Track category validation error
  const dropdownRef = useRef(null);
  const router = useRouter();

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
    // DEV NOTE: No changes needed in this function. It's performant and clean.
    const iconProps = "w-4 h-4 inline-block mr-2";
    
    switch (iconName) {
      case 'monitor':
        return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
      case 'shopping-cart':
        return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.35 2.65a1 1 0 00.7 1.7H19M7 13v4a2 2 0 002 2h2m3-6v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" /></svg>;
      case 'heart':
        return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
      case 'palette':
        return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" /></svg>;
      case 'gamepad':
        return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>;
      case 'dollar-sign':
        return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>;
      case 'utensils':
        return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 2v6c0 1.1.9 2 2 2a2 2 0 002-2V2M7 10v12M15 2v6c0 1.1.9 2 2 2a2 2 0 002-2V2M19 10v12" /></svg>;
      case 'plane':
        return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
      case 'book':
        return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
      case 'briefcase':
        return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>;
      default:
        return <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (categoryValue) => {
    setCategory(categoryValue);
    setIsDropdownOpen(false);
    setCategoryError(false); // Clear error when category is selected
  };

  const selectedCategory = categories.find(cat => cat.value === category);

  const handleAnalysis = async () => {
    // Reset errors
    setError(null);
    setCategoryError(false);

    // Validate brand name
    if (!brandName.trim()) {
      setError('Please enter a brand name');
      return;
    }

    // Validate category selection
    if (!category) {
      setCategoryError(true);
      setError('Please select a category');
      return;
    }

    setIsLoading(true);
    try {
      router.push(`/analysis?brand=${encodeURIComponent(brandName.trim())}&category=${encodeURIComponent(category)}`);
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to start analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // DEV NOTE: Adjusted vertical padding for better spacing on mobile screens (`pt-20 pb-20`) while preserving more generous padding on larger viewports.
    <section className="relative flex items-center justify-center overflow-hidden min-h-screen pt-20 pb-20 sm:pt-24 lg:pt-16 lg:pb-32 bg-[#212121]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '-3s' }}></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* DEV NOTE: Typography is already well-scaled with responsive prefixes. No changes needed. `leading-tight` is perfect for a headline. */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Avoid the Rebrand
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] to-[#764ba2]">
            Nail it the first time
          </span>
        </h1>
        
        {/* DEV NOTE: Adjusted font size and margin for better readability on smaller screens. `text-lg` is a more comfortable base for mobile. */}
        <p className="text-lg lg:text-xl text-gray-300 mb-10 lg:mb-8 max-w-2xl mx-auto leading-relaxed">
        Instantly analyze domain availability, search competition, and run AI-powered deep scans on competitors—all in one place. Go from idea to validated brand, faster.
        </p>

        <div className="max-w-3xl mx-auto mb-8">
          {/* DEV NOTE: Responsive padding `p-4` to `lg:p-8` ensures the form container has proper whitespace on all screen sizes. */}
          <div className="bg-[#212121]/50 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 border border-black/1">
            {/* DEV NOTE: Layout shifts from a column (`flex-col`) on mobile to a row (`sm:flex-row`) on small screens and up.
              - `items-stretch` on mobile makes the form elements (input, dropdown, button) have equal width, creating a clean vertical stack.
              - `sm:items-end` on larger screens aligns the elements to the bottom, which is visually appealing since the labels give them different natural heights.
              - `gap-3 sm:gap-4` provides slightly tighter spacing on mobile.
            */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
                  Enter your brand name:
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalysis()}
                  placeholder="e.g., 'Aether' or 'Zenith'"
                  // DEV NOTE: Harmonized height (`h-12 sm:h-14`) and text size for a consistent look across all form controls.
                  className="w-full h-12 sm:h-14 px-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent text-base"
                  disabled={isLoading}
                />
              </div>

              <div className="w-full sm:w-56 relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
                  Category:
                </label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full h-12 sm:h-14 px-4 bg-white/10 backdrop-blur-lg border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent cursor-pointer text-base flex items-center justify-between ${
                    categoryError ? 'border-red-500 border-2' : 'border-white/20'
                  }`}
                >
                  <span className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis">
                    {selectedCategory ? (
                      <>
                        {getIcon(selectedCategory.icon)}
                        {selectedCategory.label}
                      </>
                    ) : (
                      <span className="text-gray-400">Select a category</span>
                    )}
                  </span>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in-20">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategorySelect(cat.value)}
                        className={`w-full px-4 py-3 text-left text-base hover:bg-white/10 transition-colors duration-150 flex items-center ${
                          category === cat.value ? 'bg-[#667eea]/20 text-[#667eea]' : 'text-white'
                        }`}
                      >
                        {getIcon(cat.icon)}
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full sm:w-auto">
                {/* DEV NOTE: This label is hidden but provides semantic structure. On mobile, the button is full-width, so a visible label isn't necessary. */}
                <label className="hidden sm:block text-sm font-medium text-gray-300 mb-2 text-left opacity-0">
                  Action:
                </label>
                <Button
                  onClick={handleAnalysis}
                  disabled={isLoading || !brandName.trim()}
                  // DEV NOTE: Consistent responsive height and font size.
                  className="w-full h-12 sm:h-14 px-6 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:from-[#5a6fd6] hover:to-[#6a3f9e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#212121] focus:ring-[#667eea] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-base flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {/* DEV NOTE: Text changes responsively to fit available space. */}
                      <span className="hidden sm:inline">Analyzing...</span>
                      <span className="sm:hidden">...</span>
                    </div>
                  ) : (
                    // DEV NOTE: Swapping button text for a shorter version on mobile to prevent awkward wrapping and improve layout.
                    <>
                      <span className="sm:hidden">Analyze</span>
                      <span className="hidden sm:inline">Analyze Brand</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm text-center sm:text-left">{error}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          {/* DEV NOTE: Adjusted font size for mobile consistency. */}
          <p className="text-base sm:text-lg text-gray-400">
            <strong>"Trusted by founders, developers, and marketers at forward-thinking companies."</strong>
          </p>
        </div>
      </div>
    </section>
  );
}