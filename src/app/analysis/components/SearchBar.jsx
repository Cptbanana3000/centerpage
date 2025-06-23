'use client';

import React, { useState, useRef, useEffect } from 'react';

// Make sure you have Font Awesome loaded for icons
// import '@fortawesome/fontawesome-free/css/all.min.css';

export default function SearchBar({
  categories,
  newBrandName,
  newCategory,
  onBrandChange,
  onCategoryChange,
  onSearch,
  isSearching,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (value) => {
    onCategoryChange(value);
    setIsDropdownOpen(false);
  };

  const selectedCategoryLabel = categories.find(cat => cat.value === newCategory)?.label || 'Select Category';

  return (
    <div className="w-full max-w-2xl mx-auto" ref={dropdownRef}>
      <div className="relative flex items-center w-full h-14 bg-black/20 border border-white/20 rounded-xl shadow-lg focus-within:ring-2 focus-within:ring-[#64ffda] transition-all duration-300">
        
        {/* Category Dropdown Button */}
        <div className="relative h-full">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between h-full px-4 text-left text-white rounded-l-xl hover:bg-white/10"
          >
            <span className="truncate pr-2">{selectedCategoryLabel}</span>
            <i className={`fas fa-chevron-down text-xs text-[#8892b0] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#0a192f]/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleCategorySelect(cat.value)}
                  className={`w-full px-4 py-3 text-left text-base hover:bg-[#64ffda]/10 transition-colors duration-150 flex items-center ${
                    newCategory === cat.value ? 'text-[#64ffda]' : 'text-white'
                  }`}
                >
                  {/* You can add icons back here if needed */}
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/20"></div>

        {/* Brand Name Input */}
        <input
          type="text"
          value={newBrandName}
          onChange={(e) => onBrandChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          placeholder="Analyze a new brand name..."
          className="flex-1 h-full px-4 bg-transparent text-white placeholder-gray-500 focus:outline-none w-full sm:flex-1"
        />

        {/* Search Button */}
        <button
          onClick={onSearch}
          disabled={isSearching || !newBrandName.trim()}
          className="flex items-center justify-center w-14 h-full text-[#ccd6f6] rounded-r-xl hover:bg-[#64ffda] hover:text-[#0a192f] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 w-full sm:w-auto"
        >
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <i className="fas fa-search text-lg"></i>
          )}
        </button>
      </div>
    </div>
  );
}
