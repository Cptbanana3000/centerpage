'use client';

import GoogleCompetitorCard from './GoogleCompetitorCard';

// Make sure you have Font Awesome loaded for icons
// import '@fortawesome/fontawesome-free/css/all.min.css';

export default function GoogleCompetitorsList({ results = [], brandName }) {
  // Utility function to extract the root domain from a URL for comparison
  const extractRootDomain = (url) => {
    try {
      const hostname = new URL(url).hostname.replace(/^www\./, '');
      // This is a simple approach; more robust solutions might handle TLDs better
      return hostname.split('.')[0];
    } catch {
      // Return null for invalid URLs
      return null;
    }
  };

  // Redesigned state for when no competitors are found
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 mb-4 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
          <i className="fas fa-check text-green-400 text-2xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Clear Path Ahead</h3>
        <p className="text-[#8892b0] text-sm leading-relaxed max-w-xs">
          No direct competitors found in the top Google search results. This indicates a unique opportunity for your brand name.
        </p>
      </div>
    );
  }

  // Main list rendering with a clean, separated layout
  return (
    <div className="divide-y divide-white/10">
      {results.slice(0, 5).map((result, idx) => {
        const rootDomain = extractRootDomain(result.link);
        const isDirect = rootDomain?.toLowerCase() === brandName.toLowerCase();
        return <GoogleCompetitorCard key={idx} result={result} isDirect={isDirect} />;
      })}
    </div>
  );
}
