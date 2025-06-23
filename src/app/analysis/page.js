// src/app/analysis/page.js
'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalysisHistory } from '@/contexts/AnalysisHistoryContext';
import { Navbar } from '@/components/layout/Navbar';

import ReactMarkdown from 'react-markdown';
import ScoreCircle from './components/ScoreCircle';
import { getScoreColor } from './utils/scoreColors';
import useBrandAnalysis from './hooks/useBrandAnalysis';
import useDeepScan from './hooks/useDeepScan';
import usePdfExport from './hooks/usePdfExport';
import DeepScanPanel from './components/DeepScanPanel';
import { CATEGORIES } from './utils/categories';
import GoogleCompetitorsList from './components/GoogleCompetitorsList';
import BrandMetrics from './components/BrandMetrics';
import { Button } from '@/components/ui/button';

// Make sure you have Font Awesome loaded for icons
// import '@fortawesome/fontawesome-free/css/all.min.css';

const GlassCard = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] backdrop-blur-lg rounded-xl ${className}`}
    {...props}
  >
    {children}
  </div>
));

const LoadingScreen = ({ stageIndex, totalStages, stageLabel, viewMode }) => (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
            <div 
                className="absolute inset-0 border-4 border-[#64ffda] rounded-full animate-spin"
                style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
            ></div>
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#64ffda]">
               {viewMode !== 'saved' && `${Math.round(((stageIndex + 1) / totalStages) * 100)}%`}
            </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          {viewMode === 'saved' ? 'Loading Your Report...' : stageLabel}
        </h2>
        <p className="text-lg text-[#8892b0] max-w-md mx-auto">
          {viewMode === 'saved' 
            ? 'Retrieving your previously saved analysis.' 
            : 'Our AI is working hard to provide you with comprehensive insights.'
          }
        </p>
      </div>
    </div>
);

export default function AnalysisPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { triggerHistoryRefresh } = useAnalysisHistory();
  const { deepScanData, deepScanError, isDeepScanning, runDeepScan } = useDeepScan({ user });
  const { exporting: isExporting, exportError, exportPdf } = usePdfExport({ user });

  const [newBrandName, setNewBrandName] = useState('');
  const brandName = searchParams.get('brand');
  const category = searchParams.get('category') || CATEGORIES[0].value;
  const viewMode = searchParams.get('view');

  const [newCategory, setNewCategory] = useState(category);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSection, setActiveSection] = useState('ai-summary');

  const loadingStages = useMemo(() => [
    'Initializing analysis...', 'Analyzing domain availability...', 'AI analyzing competitors...',
    'AI evaluating SEO difficulty...', 'Generating strategic insights...', 'Finalizing AI recommendations...'
  ], []);

  const { analysis, loading, error, loadingStage } = useBrandAnalysis({
    brandName, category, viewMode, user, triggerHistoryRefresh, router,
  });

  // Scroll spy logic
  const sectionsRef = useRef({});
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -70% 0px' } // Trigger when section is in the middle 40% of the viewport
    );
    Object.values(sectionsRef.current).forEach((section) => {
      if(section) observer.observe(section);
    });
    return () => {
      Object.values(sectionsRef.current).forEach((section) => {
        if(section) observer.unobserve(section);
      });
    };
  }, [analysis]); // Rerun when analysis data is available

  if (loading || isSearching) {
    return <LoadingScreen stageIndex={loadingStage ?? 0} stageLabel={loadingStages[loadingStage] || 'Initializing analysis...'} totalStages={loadingStages.length} viewMode={viewMode} />;
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center text-center p-4">
        <div>
            <h2 className="text-3xl font-bold text-red-400 mb-4">Analysis Failed</h2>
            <p className="text-lg text-[#8892b0] mb-8">{error || 'No analysis data could be retrieved.'}</p>
            <Link href="/" passHref>
              <Button className="bg-[#64ffda] text-[#0a192f] font-bold hover:bg-white">
                Start a New Analysis
              </Button>
            </Link>
        </div>
      </div>
    );
  }

  const handleNewSearch = () => {
    if (!newBrandName.trim()) return;
    setIsSearching(true);
    router.push(`/analysis?brand=${encodeURIComponent(newBrandName.trim())}&category=${encodeURIComponent(newCategory)}`);
  };
  
  const handleDeepScan = () => runDeepScan({ brandName, category, competitorUrls: analysis?.detailedAnalysis?.googleCompetition?.topResults?.map(r => r.link) || [] });
  const handlePdfExport = () => exportPdf({ analysis, brandName, category });
  const verdictFromScore = (score) => {
    if (score >= 85) return 'Exceptional Opportunity';
    if (score >= 70) return 'Strong Contender';
    if (score >= 55) return 'Moderate Potential';
    if (score >= 40) return 'Challenging but Viable';
    return 'Not Recommended';
  };

  const reportSections = [
    { id: 'ai-summary', label: 'AI Strategic Summary', icon: 'fa-brain' },
    { id: 'brand-metrics', label: 'Brand Metrics', icon: 'fa-chart-pie' },
    { id: 'google-competitors', label: 'Google Competitors', icon: 'fa-users' },
    { id: 'domain-availability', label: 'Domain Availability', icon: 'fa-globe' },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a192f] text-gray-200 antialiased pt-16 font-['Inter',_sans-serif]">
        <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Main Report Feed (Left, Scrollable) --- */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <GlassCard id="ai-summary" ref={el => sectionsRef.current['ai-summary'] = el} className="p-8">
                        <h2 className="text-3xl font-bold mb-4 text-white flex items-center gap-3"><i className="fas fa-brain text-[#64ffda]"></i> AI Strategic Analysis</h2>
                        <p className="text-lg text-[#8892b0] mb-6 border-l-4 border-[#64ffda] pl-4"><span className="font-bold text-[#ccd6f6]">AI Verdict: </span>{analysis.verdict}</p>
                        <p className="text-md text-[#8892b0] mt-2">{analysis.summary}</p>
                    </GlassCard>
                    <GlassCard id="brand-metrics" ref={el => sectionsRef.current['brand-metrics'] = el} className="p-8">
                        <h2 className="text-3xl font-bold mb-6 text-white">Brand Metrics</h2>
                        <BrandMetrics scores={analysis.scores} />
                    </GlassCard>
                    <GlassCard id="google-competitors" ref={el => sectionsRef.current['google-competitors'] = el} className="p-8">
                         <h2 className="text-3xl font-bold mb-4 text-white">Google Competitors</h2>
                         <GoogleCompetitorsList results={analysis.detailedAnalysis.googleCompetition.topResults || []} brandName={brandName} />
                    </GlassCard>
                    <GlassCard id="domain-availability" ref={el => sectionsRef.current['domain-availability'] = el} className="p-8">
                        <h2 className="text-3xl font-bold mb-4 text-white">Domain Availability</h2>
                        <div className="divide-y divide-white/10">
                            {analysis.detailedAnalysis.domainAvailability.map((domain) => (
                                <div key={domain.domain} className="flex items-center justify-between py-4">
                                    <span className="text-lg text-[#ccd6f6]">{domain.domain}</span>
                                    {domain.isAvailable ? 
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-300">Available</span> : 
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-300">Taken</span>
                                    }
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* --- Control Panel (Right, Sticky) --- */}
                <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit flex flex-col gap-8">
                    <GlassCard className="p-8 flex flex-col items-center justify-center text-center">
                        <p className="font-semibold text-lg text-[#8892b0]">Overall Score for <span className="text-white">&ldquo;{brandName}&rdquo;</span></p>
                        <ScoreCircle score={analysis.overallScore} size={160} />
                        <p className={`mt-4 text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>{analysis.verdict}</p>
                    </GlassCard>

                    <GlassCard className="p-4">
                        <h2 className="text-lg font-bold mb-2 text-white px-2">Report Sections</h2>
                        <nav className="flex flex-col gap-1">
                            {reportSections.map(section => (
                                <a key={section.id} href={`#${section.id}`} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${activeSection === section.id ? 'bg-[#64ffda] text-[#0a192f]' : 'text-[#8892b0] hover:bg-white/5 hover:text-white'}`}>
                                    <i className={`fas ${section.icon} w-5 text-center`}></i>
                                    <span>{section.label}</span>
                                </a>
                            ))}
                        </nav>
                    </GlassCard>
                    
                    <GlassCard className="p-6">
                         <h2 className="text-xl font-bold mb-4 text-white">Actions</h2>
                         <div className="flex flex-col gap-4">
                             <Button onClick={handleDeepScan} disabled={isDeepScanning} className="w-full bg-[#64ffda]/10 border border-[#64ffda]/50 text-[#64ffda] hover:bg-[#64ffda]/20 h-14 font-bold"><i className="fas fa-microscope mr-2"></i>Perform Deep Scan</Button>
                             <Button onClick={handlePdfExport} disabled={isExporting} className="w-full bg-white/10 border border-white/20 hover:bg-white/20 h-14 font-bold"><i className="fas fa-file-pdf mr-2"></i>Export PDF</Button>
                         </div>
                         {exportError && <p className="text-red-400 text-sm mt-4">{exportError}</p>}
                    </GlassCard>

                    <GlassCard className="p-6 flex flex-col gap-4 items-center">
                        <h2 className="text-xl font-bold text-white">Start Another Analysis</h2>
                        <Button onClick={() => router.push('/')} className="w-full bg-[#64ffda]/10 border border-[#64ffda]/50 text-[#64ffda] hover:bg-[#64ffda]/20 h-12 font-bold">
                            <i className="fas fa-plus mr-2"></i> New Analysis
                        </Button>
                    </GlassCard>
                </aside>
            </div>

            <DeepScanPanel
                brandName={brandName}
                deepScanData={deepScanData}
                deepScanError={deepScanError}
                isDeepScanning={isDeepScanning}
                onRetry={handleDeepScan}
            />
        </main>
      </div>
      
    </>
  );
}
