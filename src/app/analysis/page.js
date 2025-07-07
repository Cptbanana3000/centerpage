// src/app/analysis/page.js
'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalysisHistory } from '@/contexts/AnalysisHistoryContext';
import { Navbar } from '@/components/layout/Navbar';

import ReactMarkdown from 'react-markdown';
import ScoreCircle from './components/ScoreCircle';
import { getScoreColor } from './utils/scoreColors';
import useBrandAnalysis from './hooks/useBrandAnalysis';
import usePdfExport from './hooks/usePdfExport';
import DeepScanPanel from './components/DeepScanPanel';
import SmartCompetitorSelection from './components/SmartCompetitorSelection';
import { CATEGORIES } from './utils/categories';
import GoogleCompetitorsList from './components/GoogleCompetitorsList';
import BrandMetrics from './components/BrandMetrics';
import { Button } from '@/components/ui/button';
import { useAnalysis } from '@/hooks/useAnalysis';
import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, FileText, BrainCircuit, PieChart, Users, Globe, Plus } from 'lucide-react';

// Make sure you have Font Awesome loaded for icons
// import '@fortawesome/fontawesome-free/css/all.min.css';

const StyledCard = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-white border border-gray-200 rounded-xl ${className}`}
    {...props}
  >
    {children}
  </div>
));
StyledCard.displayName = 'StyledCard';

const LoadingScreen = ({ stageIndex, totalStages, stageLabel, viewMode }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div 
                className="absolute inset-0 border-4 border-gray-800 rounded-full animate-spin"
                style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
            ></div>
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-800">
               {viewMode !== 'saved' && `${Math.round(((stageIndex + 1) / totalStages) * 100)}%`}
            </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {viewMode === 'saved' ? 'Loading Your Report...' : stageLabel}
        </h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
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
  const { exporting: isExporting, exportError, exportPdf } = usePdfExport({ user });

  const [showCompetitorSelection, setShowCompetitorSelection] = useState(false);
  const [deepScanParams, setDeepScanParams] = useState(null);
  const [deepScanResult, setDeepScanResult] = useState(null);
  const [isDeepScanning, setIsDeepScanning] = useState(false);

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
    const currentSections = sectionsRef.current; // Capture ref snapshot
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
    Object.values(currentSections).forEach((section) => {
      if(section) observer.observe(section);
    });
    return () => {
      Object.values(currentSections).forEach((section) => {
        if(section) observer.unobserve(section);
      });
    };
  }, [analysis]); // Rerun when analysis data is available

  if (loading || isSearching) {
    return <LoadingScreen stageIndex={loadingStage ?? 0} stageLabel={loadingStages[loadingStage] || 'Initializing analysis...'} totalStages={loadingStages.length} viewMode={viewMode} />;
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
        <div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">Analysis Failed</h2>
            <p className="text-lg text-gray-600 mb-8">{error || 'No analysis data could be retrieved.'}</p>
            <Link href="/" passHref>
              <Button className="bg-gray-900 text-white font-bold hover:bg-gray-800">
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
  
  const handleDeepScanClick = () => setShowCompetitorSelection(true);
  
  const handleCompetitorSelectionProceed = (selectedCompetitors) => {
    setShowCompetitorSelection(false);
    if (Array.isArray(selectedCompetitors) && selectedCompetitors.length > 0) {
      setIsDeepScanning(true);
      const competitorUrls = selectedCompetitors.map(comp => comp.link);
      setDeepScanParams({ brandName, category, competitorUrls });
    } else {
      console.warn('Deep scan was initiated without any selected competitors.');
    }
  };

  const handleCompetitorSelectionCancel = () => {
    setShowCompetitorSelection(false);
  };

  const handleAnalysisComplete = (data) => {
    setDeepScanResult(data);
    setIsDeepScanning(false);
  };

  const handlePdfExport = () => exportPdf({ analysis, brandName, category, deepScanData: deepScanResult });

  const verdictFromScore = (score) => {
    if (score >= 85) return 'Exceptional Opportunity';
    if (score >= 70) return 'Strong Contender';
    if (score >= 55) return 'Moderate Potential';
    if (score >= 40) return 'Challenging but Viable';
    return 'Not Recommended';
  };

  const reportSections = [
    { id: 'ai-summary', label: 'Strategic Summary', icon: BrainCircuit },
    { id: 'brand-metrics', label: 'Brand Metrics', icon: PieChart },
    { id: 'google-competitors', label: 'Google Competitors', icon: Users },
    { id: 'domain-availability', label: 'Domain Availability', icon: Globe },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800 antialiased pt-16 font-['Inter',_sans-serif]">
        <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Main Report Feed (Left, Scrollable) --- */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <StyledCard id="ai-summary" ref={el => sectionsRef.current['ai-summary'] = el} className="p-8">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900 flex items-center gap-3"><BrainCircuit className="h-8 w-8 text-gray-800" /> Strategic Analysis</h2>
                        <p className="text-lg text-gray-600 mb-6 border-l-4 border-gray-800 pl-4"><span className="font-bold text-gray-900">Verdict: </span>{analysis.verdict}</p>
                        <p className="text-md text-gray-600 mt-2">{analysis.summary}</p>
                    </StyledCard>
                    <StyledCard id="brand-metrics" ref={el => sectionsRef.current['brand-metrics'] = el} className="p-8">
                        <BrandMetrics scores={analysis.scores} />
                    </StyledCard>
                    <StyledCard id="google-competitors" ref={el => sectionsRef.current['google-competitors'] = el} className="p-8">
                         <h2 className="text-3xl font-bold mb-4 text-gray-900">Google Competitors</h2>
                         <GoogleCompetitorsList results={analysis.detailedAnalysis?.googleCompetition?.topResults || []} brandName={brandName} />
                    </StyledCard>
                    <StyledCard id="domain-availability" ref={el => sectionsRef.current['domain-availability'] = el} className="p-8">
    <h2 className="text-3xl font-bold mb-4 text-gray-900">Domain Availability</h2>
    <div className="divide-y divide-gray-200">
        {(analysis.detailedAnalysis?.domainAvailability || []).map((domain) => (
            <div key={domain.domain} className="flex items-center justify-between py-4">
                <span className="text-lg text-gray-800">{domain.domain}</span>
                {domain.isAvailable ? 
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Available</span> : 
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Taken</span>
                }
            </div>
        ))}
        {(!analysis.detailedAnalysis?.domainAvailability || analysis.detailedAnalysis.domainAvailability.length === 0) && (
            <p className="text-gray-500 italic py-4">No domain availability data available.</p>
        )}
    </div>
</StyledCard>
                    
                </div>

                {/* --- Control Panel (Right, Sticky) --- */}
                <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit flex flex-col gap-8">
                    <StyledCard className="p-8 flex flex-col items-center justify-center text-center">
                        <p className="font-semibold text-lg text-gray-600">Overall Score for <span className="text-gray-900">&ldquo;{brandName}&rdquo;</span></p>
                        <ScoreCircle score={analysis.overallScore} size={160} />
                        <p className={`mt-4 text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>{analysis.verdict}</p>
                    </StyledCard>

                    <StyledCard className="p-4">
                        <h2 className="text-lg font-bold mb-2 text-gray-900 px-2">Report Sections</h2>
                        <nav className="flex flex-col gap-1">
                            {reportSections?.map(section => (
                                <a key={section.id} href={`#${section.id}`} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${activeSection === section.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                                    <section.icon className="h-5 w-5 shrink-0" />
                                    <span>{section.label}</span>
                                </a>
                            ))}
                        </nav>
                    </StyledCard>
                    
                    <StyledCard className="p-6">
                         <div className="flex flex-col gap-4">
                             <Button onClick={handleDeepScanClick} disabled={isDeepScanning} className="w-full bg-gray-800 text-white hover:bg-gray-900 h-14 font-bold text-lg flex items-center justify-center gap-2">
                                 <Microscope className="h-5 w-5" />
                                 <span>{isDeepScanning ? 'Scan in Progress...' : 'Perform Deep Scan'}</span>
                             </Button>
                             <Button onClick={handlePdfExport} disabled={isExporting || !deepScanResult} className="w-full bg-gray-100 border border-gray-300 text-gray-800 hover:bg-gray-200 h-14 font-bold text-lg flex items-center justify-center gap-2">
                                 <FileText className="h-5 w-5" />
                                 <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
                             </Button>
                         </div>
                         {exportError && <p className="text-red-600 text-sm mt-4">{exportError}</p>}
                    </StyledCard>

                    <StyledCard className="p-6 flex flex-col gap-4 items-center">
                        <h2 className="text-xl font-bold text-gray-900">Start Another Analysis</h2>
                        <Button onClick={() => router.push('/')} className="w-full bg-gray-800 text-white hover:bg-gray-900 h-12 font-bold flex items-center justify-center gap-2">
                            <Plus className="h-5 w-5" />
                            <span>New Analysis</span>
                        </Button>
                    </StyledCard>
                </aside>
            </div>

            {showCompetitorSelection && (
              <SmartCompetitorSelection
                googleCompetitors={analysis.detailedAnalysis?.googleCompetition?.topResults || []}
                onProceed={handleCompetitorSelectionProceed}
                onCancel={handleCompetitorSelectionCancel}
              />
            )}

            {deepScanParams && (
              <DeepScanPanel
                key={JSON.stringify(deepScanParams)}
                brandName={deepScanParams.brandName}
                category={deepScanParams.category}
                competitorUrls={deepScanParams.competitorUrls}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}

            {analysis?.deepScanData && !deepScanParams && (
              <DeepScanPanel
                key="saved-report"
                deepScanData={analysis.deepScanData}
              />
            )}
        </main>
      </div>
      
    </>
  );
}
