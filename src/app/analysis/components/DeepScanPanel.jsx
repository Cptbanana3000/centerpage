'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';

// Make sure you have Font Awesome loaded for icons
// import '@fortawesome/fontawesome-free/css/all.min.css';

const PremiumGlassCard = ({ children, className = '', gradient = false }) => (
  <div className={`
    relative overflow-hidden
    ${gradient 
      ? 'bg-gradient-to-br from-[rgba(100,255,218,0.08)] via-[rgba(255,255,255,0.05)] to-[rgba(100,255,218,0.03)]' 
      : 'bg-[rgba(255,255,255,0.08)]'
    }
    border border-[rgba(100,255,218,0.2)] 
    backdrop-blur-xl rounded-2xl 
    shadow-2xl shadow-[rgba(100,255,218,0.1)]
    before:absolute before:inset-0 before:bg-gradient-to-br before:from-[rgba(100,255,218,0.05)] before:to-transparent before:pointer-events-none
    ${className}
  `}>
    {children}
  </div>
);

const PremiumStatDisplay = ({ label, value, icon, trend, trendValue }) => (
  <div className="text-center group hover:scale-105 transition-all duration-300">
    <div className="relative">
      <div className="flex justify-center items-center gap-3 mb-3">
        <div className="relative">
          <div className="absolute inset-0 bg-[#64ffda]/20 rounded-full blur-md"></div>
          <div className="relative w-10 h-10 bg-gradient-to-br from-[#64ffda]/30 to-[#64ffda]/10 rounded-full flex items-center justify-center border border-[#64ffda]/30">
            <i className={`fas ${icon} text-[#64ffda] text-lg`}></i>
          </div>
        </div>
      </div>
      <p className="text-sm font-semibold text-[#ccd6f6] mb-2 tracking-wide uppercase">{label}</p>
      <div className="flex items-center justify-center gap-2">
        <p className="text-4xl font-black text-white tracking-tight">{value}</p>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
            trend === 'up' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            <i className={`fas fa-arrow-${trend} text-xs`}></i>
            {trendValue}
          </div>
        )}
      </div>
    </div>
  </div>
);

const CompetitorCard = ({ competitor, index }) => (
  <PremiumGlassCard className="hover:border-[rgba(100,255,218,0.4)] transition-all duration-500 group">
    {/* Header with URL and Status */}
    <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[rgba(100,255,218,0.05)] to-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#64ffda]/30 to-[#64ffda]/10 rounded-xl flex items-center justify-center border border-[#64ffda]/30">
              <i className="fas fa-globe text-[#64ffda] text-xl"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-[#0a192f] rounded-full"></div>
          </div>
          <div>
            <h4 className="text-xl font-bold text-white mb-1 group-hover:text-[#64ffda] transition-colors">
              <a href={competitor.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {new URL(competitor.url).hostname.replace('www.', '')}
              </a>
            </h4>
            <p className="text-[#8892b0] text-sm">{competitor.url}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="px-3 py-1 bg-[#64ffda]/20 text-[#64ffda] text-xs font-bold rounded-full border border-[#64ffda]/30">
            ANALYZED
          </div>
        </div>
      </div>
    </div>

    {/* Content Grid */}
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Site Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="group/item">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(100,255,218,0.2)] transition-all">
                <i className="fas fa-heading text-[#64ffda] mt-1 flex-shrink-0"></i>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#64ffda] uppercase tracking-wider mb-1">Page Title</p>
                  <p className="text-white font-medium leading-relaxed">{competitor.title || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="group/item">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(100,255,218,0.2)] transition-all">
                <i className="fas fa-h1 text-[#64ffda] mt-1 flex-shrink-0"></i>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#64ffda] uppercase tracking-wider mb-1">Main Heading</p>
                  <p className="text-white font-medium leading-relaxed">{competitor.h1 || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="group/item">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(100,255,218,0.2)] transition-all">
                <i className="fas fa-file-text text-[#64ffda] mt-1 flex-shrink-0"></i>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#64ffda] uppercase tracking-wider mb-1">Meta Description</p>
                  <p className="text-white font-medium leading-relaxed">{competitor.metaDescription || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(100,255,218,0.05)] to-[rgba(255,255,255,0.02)] border border-[rgba(100,255,218,0.1)]">
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-code text-[#64ffda]"></i>
              <p className="text-xs font-bold text-[#64ffda] uppercase tracking-wider">Technology Stack</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {competitor.technologyStack?.length > 0 ? 
                competitor.technologyStack.slice(0, 8).map((tech) => (
                  <span key={tech} className="px-3 py-1.5 bg-[rgba(100,255,218,0.15)] text-[#64ffda] text-xs font-semibold rounded-lg border border-[rgba(100,255,218,0.3)] hover:bg-[rgba(100,255,218,0.25)] transition-all">
                    {tech}
                  </span>
                )) : 
                <span className="text-[#8892b0] text-sm italic">No technologies detected</span>
              }
            </div>
          </div>
        </div>

        {/* Right Column - Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 text-center group hover:scale-105 transition-all">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
              <i className="fas fa-file-word text-blue-400 text-xl"></i>
            </div>
            <div className="text-3xl font-black text-white mb-1">{competitor.wordCount?.toLocaleString() || 'N/A'}</div>
            <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Words</div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 text-center group hover:scale-105 transition-all">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
              <i className="fas fa-tachometer-alt text-green-400 text-xl"></i>
            </div>
            <div className="text-3xl font-black text-white mb-1">{competitor.performance?.pageLoadTime || 'N/A'}s</div>
            <div className="text-xs font-semibold text-green-300 uppercase tracking-wider">Load Time</div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 text-center group hover:scale-105 transition-all">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
              <i className="fas fa-link text-purple-400 text-xl"></i>
            </div>
            <div className="text-3xl font-black text-white mb-1">{competitor.internalLinks || 'N/A'}</div>
            <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Internal</div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 text-center group hover:scale-105 transition-all">
            <div className="w-12 h-12 mx-auto mb-3 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
              <i className="fas fa-external-link-alt text-orange-400 text-xl"></i>
            </div>
            <div className="text-3xl font-black text-white mb-1">{competitor.externalLinks || 'N/A'}</div>
            <div className="text-xs font-semibold text-orange-300 uppercase tracking-wider">External</div>
          </div>
        </div>
      </div>
    </div>
  </PremiumGlassCard>
);

export default function DeepScanPanel({
  brandName,
  deepScanData,
  deepScanError,
  isDeepScanning,
  onRetry,
}) {
  // Don't render anything if there's no active scan, data, or error
  if (!deepScanData && !deepScanError && !isDeepScanning) {
    return null;
  }

  return (
    <div className="mt-20 pt-16 border-t border-[rgba(100,255,218,0.2)] relative">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(100,255,218,0.02)] to-transparent pointer-events-none"></div>
      
      {/* Premium Header */}
      <div className="relative mb-12 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#64ffda]/20 to-[#64ffda]/10 rounded-full border border-[#64ffda]/30 mb-6">
          <i className="fas fa-crown text-[#64ffda] text-sm"></i>
          <span className="text-[#64ffda] text-sm font-bold uppercase tracking-wider">Premium Intelligence</span>
        </div>
        
        <h2 className="text-5xl font-black text-white mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-white via-[#ccd6f6] to-[#64ffda] bg-clip-text text-transparent">
            Deep Scan Intelligence Report
          </span>
        </h2>
        <p className="text-xl text-[#8892b0] leading-relaxed max-w-2xl mx-auto">
          Advanced AI-powered competitive analysis with live-scraped data and strategic insights.
        </p>
        
        {/* Decorative Elements */}
        <div className="flex justify-center items-center gap-8 mt-8">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-[#64ffda]/50"></div>
          <div className="w-3 h-3 bg-[#64ffda] rounded-full animate-pulse"></div>
          <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-[#64ffda]/50"></div>
        </div>
      </div>

      {/* Loading State */}
      {isDeepScanning && (
        <PremiumGlassCard className="p-12 text-center" gradient={true}>
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-[#64ffda]/20 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-[#64ffda]/40 rounded-full animate-spin animate-reverse"></div>
            <div className="absolute inset-4 border-2 border-[#64ffda]/60 rounded-full animate-ping"></div>
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#64ffda]/20 to-[#64ffda]/5 rounded-full border border-[#64ffda]/30">
              <i className="fas fa-satellite-dish text-4xl text-[#64ffda] animate-pulse"></i>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Performing Deep Scan Analysis</h3>
          <p className="text-[#8892b0] text-lg leading-relaxed max-w-md mx-auto">
            Scraping competitor websites and generating AI-powered strategic insights. This advanced analysis may take a moment.
          </p>
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-[#64ffda] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#64ffda] rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-[#64ffda] rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </PremiumGlassCard>
      )}

      {/* Error State */}
      {deepScanError && (
        <PremiumGlassCard className="p-8 border-red-500/30 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/30">
            <i className="fas fa-exclamation-triangle text-red-400 text-3xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-red-400 mb-4">Deep Scan Analysis Failed</h3>
          <p className="text-[#8892b0] text-lg mb-6 max-w-md mx-auto">{deepScanError}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              className="bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 px-8 py-3 text-lg font-semibold rounded-xl transition-all"
            >
              <i className="fas fa-redo mr-2"></i>
              Retry Deep Scan
            </Button>
          )}
        </PremiumGlassCard>
      )}

      {/* Results */}
      {deepScanData && (
        <div className="space-y-12">
          {/* Summary Stats */}
          <PremiumGlassCard className="p-8" gradient={true}>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Scan Overview</h3>
              <p className="text-[#8892b0]">Comprehensive analysis metrics from your deep scan</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <PremiumStatDisplay 
                label="Competitors" 
                value={deepScanData.competitorsAnalyzed?.length || 0} 
                icon="fa-users" 
              />
              <PremiumStatDisplay 
                label="Data Points" 
                value={(deepScanData.competitorsAnalyzed?.length || 0) * 16} 
                icon="fa-chart-line" 
              />
              <PremiumStatDisplay 
                label="Strategic Report" 
                value={deepScanData.comparativeAnalysis ? '✓' : '✗'} 
                icon="fa-file-contract" 
              />
              <PremiumStatDisplay 
                label="Generated" 
                value={deepScanData.timestamp ? new Date(deepScanData.timestamp).toLocaleDateString() : 'N/A'} 
                icon="fa-calendar-check" 
              />
            </div>
          </PremiumGlassCard>

          {/* Competitor Analyses */}
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Competitor Analysis</h3>
              <p className="text-[#8892b0] text-lg">Detailed breakdown of each competitor's digital presence</p>
            </div>
            {deepScanData.competitorsAnalyzed?.map((competitor, index) => (
              <CompetitorCard key={index} competitor={competitor} index={index} />
            ))}
          </div>

          {/* Strategic Analysis */}
          {deepScanData.comparativeAnalysis && (
            <PremiumGlassCard>
              <div className="p-8 border-b border-[rgba(100,255,218,0.2)] bg-gradient-to-r from-[rgba(100,255,218,0.05)] to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#64ffda]/30 to-[#64ffda]/10 rounded-2xl flex items-center justify-center border border-[#64ffda]/30">
                      <i className="fas fa-chess-knight text-[#64ffda] text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-1">Strategic Battle Plan</h3>
                      <p className="text-[#8892b0]">AI-generated competitive intelligence and actionable insights</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-[#64ffda]/20 to-[#64ffda]/10 text-[#64ffda] text-sm font-bold rounded-xl border border-[#64ffda]/30">
                    AI GENERATED
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="prose prose-invert max-w-none text-[#8892b0] leading-relaxed 
                               prose-headings:text-[#ccd6f6] prose-headings:font-bold
                               prose-strong:text-white prose-strong:font-semibold
                               prose-ul:list-none prose-ul:space-y-2
                               prose-li:relative prose-li:pl-6 prose-li:before:content-['▶'] prose-li:before:text-[#64ffda] prose-li:before:absolute prose-li:before:left-0
                               prose-p:text-[#8892b0] prose-p:leading-relaxed
                               prose-h1:text-2xl prose-h1:text-white prose-h1:border-b prose-h1:border-[#64ffda]/30 prose-h1:pb-2
                               prose-h2:text-xl prose-h2:text-[#ccd6f6] prose-h2:mt-8 prose-h2:mb-4
                               prose-h3:text-lg prose-h3:text-[#64ffda] prose-h3:mt-6 prose-h3:mb-3">
                  <ReactMarkdown>{deepScanData.comparativeAnalysis}</ReactMarkdown>
                </div>
              </div>
            </PremiumGlassCard>
          )}
        </div>
      )}
    </div>
  );
}