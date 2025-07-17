'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ShieldCheck, Globe, FileText, Heading1, BookText, Cpu, Timer, Link2, ExternalLink, Users, Database, FileSignature, CalendarCheck, Frown, Loader, Crown, Bot, Hourglass, Activity, Eye,
} from 'lucide-react';
import useDeepScan from '../hooks/useDeepScan';

// Helper component for Icons. Assumes you're using a library like Lucide React,
// but you can replace this with your own icon implementation (e.g., Font Awesome).
// Example: npm install lucide-react

// --- New dynamic messages for the polling state ---
const engagingMessages = [
  "Scanning competitors... This is saving you hours of manual research.",
  "Analyzing SEO signals... We're finding the vulnerabilities you can exploit.",
  "Deconstructing their content strategy to reveal what wins them traffic.",
  "Mapping their technology stack so you know the tools they rely on.",
  "Running performance benchmarks, because in the race for customers, speed is key.",
  "Our AI is connecting the dots and turning raw data into your new game plan.",
  "Identifying their top keywords so you'll know exactly what to target.",
  "Assembling your strategic report... Get ready for some deep insights."
];

const IconWrapper = ({ icon: Icon, className = '' }) => (
  <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${className}`}>
    <Icon className="w-6 h-6" />
  </div>
);

// Main Card component with a subtle shadow and refined border
const PanelCard = ({ children, className = '', highlight = false }) => (
  <div
    className={`
    bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-2xl shadow-sm transition-all duration-300 overflow-hidden
    ${highlight ? 'border-indigo-500/30 shadow-lg' : 'hover:border-gray-300'}
    ${className}
  `}
  >
    {children}
  </div>
);

// Component for displaying key stats with improved layout
const StatDisplay = ({ label, value, icon: Icon, color = 'gray' }) => {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className={`p-4 rounded-lg flex items-center gap-4 ${colorClasses[color]}`}>
      <div className="flex-shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};


// A more detailed and visually separated card for each competitor
const CompetitorCard = ({ competitor }) => (
  <PanelCard>
    {/* Card Header */}
    <div className="p-5 border-b border-gray-200/80 flex items-center justify-between bg-gray-50/50">
      <div className="flex items-center gap-4">
        <IconWrapper icon={Globe} className="bg-gray-100 text-gray-600" />
        <div>
          <h4 className="text-lg font-bold text-gray-800">
            <a href={competitor.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline transition-colors">
              {new URL(competitor.url).hostname.replace('www.', '')}
            </a>
          </h4>
          <p className="text-gray-500 text-xs truncate max-w-xs">{competitor.url}</p>
        </div>
      </div>
      <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200/80">
        Analyzed
      </div>
    </div>

    {/* Main Content Body */}
    <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left Column: SEO & Content */}
            <div className="md:col-span-3 space-y-4">
                <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Content & SEO</h5>
                <div className="space-y-3">
                    <InfoItem icon={FileText} label="Page Title" value={competitor.title} />
                    <InfoItem icon={Heading1} label="Main Heading (H1)" value={competitor.h1} />
                    <InfoItem icon={BookText} label="Meta Description" value={competitor.metaDescription} />
                </div>
            </div>

            {/* Right Column: Key Metrics */}
            <div className="md:col-span-2 space-y-4 bg-gray-50/70 p-4 rounded-lg border border-gray-200/60">
                <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Metrics</h5>
                <div className="space-y-3">
                <StatDisplay icon={FileSignature} label="Word Count" value={competitor.wordCount?.toLocaleString() || 'N/A'} color="indigo" />
                <StatDisplay icon={Timer} label="Page Load Time" value={`${competitor.performance?.pageLoadTime || 'N/A'}s`} color="green" />
                <StatDisplay icon={Link2} label="Internal Links" value={competitor.internalLinks || 'N/A'} color="purple" />
                <StatDisplay icon={ExternalLink} label="External Links" value={competitor.externalLinks || 'N/A'} color="orange" />
                </div>
            </div>
        </div>
    </div>

    {/* Tech Stack Section (Highlighted) */}
    <div className="border-t border-indigo-200/60 px-5 py-4 bg-indigo-50/50">
        <div className="flex items-center gap-3 mb-3">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h5 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Technology Stack</h5>
        </div>
        <div className="flex flex-wrap gap-2">
            {competitor.technologyStack?.length > 0 ? (
            competitor.technologyStack.slice(0, 10).map((tech) => (
                <span key={tech} className="px-3 py-1.5 bg-white text-indigo-900 text-xs font-semibold rounded-lg border border-indigo-200/80 shadow-sm hover:bg-indigo-50 transition-colors cursor-default">
                    {tech}
                </span>
            ))
            ) : (
            <span className="text-gray-500 text-sm italic">No technologies detected</span>
            )}
        </div>
    </div>
  </PanelCard>
);

// Helper for structured info display
const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50/80 transition-colors">
        <Icon className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
        <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-500">{label}</p>
            <p className="text-gray-800 font-medium leading-snug">{value || <span className="text-gray-400 italic">Not found</span>}</p>
        </div>
    </div>
);

// --- Progress Bar Component ---
const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 my-4">
    <div
      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

// --- New Status Messages for Polling ---
const statusMessages = {
  waiting: 'Job is queued. Starting soon...',
  active: 'Actively analyzing competitor websites...',
  completed: 'Analysis complete!',
  failed: 'An error occurred during analysis.'
};

// =================================================================================
// --- NEW COMPONENTS FOR V3 MULTI-AGENT REPORT ---
// =================================================================================

// --- 1. Strength & Weakness List ---
const StrengthWeaknessList = ({ title, items, color }) => {
  const colorClasses = {
    green: 'border-l-green-500 bg-green-50 text-green-800',
    red: 'border-l-red-500 bg-red-50 text-red-800',
  };
  return (
    <div>
      <h4 className={`text-lg font-bold mb-3 text-${color}-700`}>{title}</h4>
      <ul className="space-y-2">
        {items?.map((item, index) => (
          <li key={index} className={`p-3 rounded-lg border-l-4 ${colorClasses[color]}`}>
            {item}
          </li>
        )) || <li className="text-gray-500 italic">No data available.</li>}
      </ul>
    </div>
  );
};


// --- 2. Agent Report Tabs ---
const AgentReportTabs = ({ reports }) => {
  const [activeTab, setActiveTab] = useState('technical');
  const tabs = [
    { id: 'technical', label: 'Technical', icon: ShieldCheck },
    { id: 'content', label: 'Content', icon: BookText },
    { id: 'visual_ux', label: 'Visual UX', icon: Eye },
  ];
  
  const activeReport = reports[activeTab];

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 rounded-t-lg transition-all
        ${activeTab === id 
          ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' 
          : 'bg-gray-100/70 text-gray-600 hover:bg-gray-200/70'
        }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div>
      {/* Mobile Dropdown */}
      <div className="md:hidden mb-4">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 font-medium"
        >
          {tabs.map(tab => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Desktop Tabs */}
      <div className="hidden md:flex border-b border-gray-200 bg-gray-50/50 rounded-t-lg overflow-x-auto flex-nowrap">
        {tabs.map(tab => <TabButton key={tab.id} {...tab} />)}
      </div>
      <div className="p-4 md:p-6 bg-white rounded-b-lg overflow-y-auto max-h-[400px] md:max-h-none">
        {activeReport ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StrengthWeaknessList title="Strengths" items={activeReport.strengths} color="green" />
            <StrengthWeaknessList title="Weaknesses" items={activeReport.weaknesses} color="red" />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Frown className="w-8 h-8 mx-auto mb-2" />
            <p>Analysis data for this category is not available.</p>
          </div>
        )}
      </div>
    </div>
  );
};


// --- 3. New Competitor Card (replaces the old one) ---
const NewCompetitorCard = ({ report }) => {
  // Handle the partial failure case
  if (report.error) {
    return (
      <PanelCard className="p-6 border-amber-500/40">
        <div className="flex items-center gap-4">
          <IconWrapper icon={Globe} className="bg-amber-100 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-800 break-all">
                {new URL(report.url).hostname.replace('www.', '')}
            </h4>
          </div>
          <div className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200/80">
            Analysis Failed
          </div>
        </div>
        <p className="mt-4 text-center text-amber-700 bg-amber-50/80 p-4 rounded-lg">{report.error}</p>
      </PanelCard>
    );
  }

  const { raw_data_summary: summary, specialist_reports: reports, url } = report;

  return (
    <PanelCard>
      {/* Card Header */}
      <div className="p-5 border-b border-gray-200/80 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-4 min-w-0">
          <IconWrapper icon={Globe} className="bg-gray-100 text-gray-600 flex-shrink-0" />
          <div className="min-w-0">
            <h4 className="text-lg font-bold text-gray-800 truncate">
              <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline transition-colors">
                {new URL(url).hostname.replace('www.', '')}
              </a>
            </h4>
            <p className="text-gray-500 text-xs truncate">{url}</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200/80 flex-shrink-0">
          Analyzed
        </div>
      </div>
  
      {/* Main Content Body - Summary Stats */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatDisplay label="Word Count" value={summary.wordCount?.toLocaleString() || 'N/A'} icon={FileSignature} color="indigo" />
        <StatDisplay label="Load Time" value={`${summary.performance?.pageLoadTime || 'N/A'}`} icon={Timer} color="green" />
        <StatDisplay label="FCP" value={`${summary.performance?.firstContentfulPaint || 'N/A'}`} icon={Activity} color="green" />
      </div>

      {/* --- PREMIUM TECH STACK SECTION --- */}
      <div className="border-y border-gray-200/80 px-5 py-4 bg-gradient-to-br from-gray-50/50 to-gray-100/50">
        <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h5 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Technology Stack</h5>
        </div>
        <div className="flex flex-wrap gap-3">
            {summary.techStack?.length > 0 ? (
            summary.techStack.map((tech) => (
                <span key={tech} className="px-4 py-2 bg-white text-gray-800 text-sm font-medium rounded-full border border-gray-200/80 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-default">
                    {tech}
                </span>
            ))
            ) : (
            <span className="text-gray-500 text-sm italic">No technologies detected.</span>
            )}
        </div>
      </div>
  
      {/* Agent Reports (Tabs) */}
      <div className="px-5 pt-5 pb-5">
        <AgentReportTabs reports={reports} />
      </div>
    </PanelCard>
  );
};


// =================================================================================
// --- MAIN PANEL COMPONENT ---
// =================================================================================

export default function DeepScanPanel({ brandName, category, competitorUrls, onAnalysisComplete, deepScanData: initialData }) {
  // --- Use the new hook ---
  const {
    runDeepScan,
    status,
    progress,
  deepScanData,
  deepScanError,
  } = useDeepScan();

  // --- State for dynamic UI during polling ---
  const [displayProgress, setDisplayProgress] = React.useState(0);
  const [currentMessage, setCurrentMessage] = React.useState(engagingMessages[0]);
  
  const finalData = initialData || deepScanData;
  const currentStatus = initialData ? 'success' : status;

  // --- Automatically run the scan when the component mounts with the right props ---
  React.useEffect(() => {
    if (initialData) return;

    if (brandName && category && competitorUrls?.length > 0) {
      runDeepScan({ brandName, category, competitorUrls });
    }
  }, [brandName, category, competitorUrls, initialData, runDeepScan]); // Dependency array ensures it runs once per analysis

  // --- Effect for managing the dynamic UI (progress bar and messages) ---
  React.useEffect(() => {
    if (currentStatus === 'polling') {
      const messageInterval = setInterval(() => {
        setCurrentMessage(prev => engagingMessages[(engagingMessages.indexOf(prev) + 1) % engagingMessages.length]);
      }, 3500);

      // Start the smooth animation from the current *real* progress.
      setDisplayProgress(current => Math.max(current, progress));
      
      const progressInterval = setInterval(() => {
        setDisplayProgress(oldProgress => {
          if (oldProgress >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          // Animate towards 95%
          return oldProgress + (95 - oldProgress) * 0.1;
        });
      }, 800);

      return () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      };
    } else {
      // For any other state (starting, success, error), sync display progress with real progress.
      if (currentStatus === 'success') {
          // A short delay before jumping to 100% feels more satisfying.
          setTimeout(() => setDisplayProgress(100), 300);
      } else {
          setDisplayProgress(progress);
      }
    }
  }, [currentStatus, progress]);

  // --- Propagate the result to the parent component ---
  React.useEffect(() => {
    if (status === 'success' && deepScanData) {
      onAnalysisComplete?.(deepScanData);
    }
  }, [status, deepScanData, onAnalysisComplete]);

  // This function will be passed to the error card's retry button
  const handleRetry = () => {
    runDeepScan({ brandName, category, competitorUrls });
  };

  return (
    <div className="mt-16 sm:mt-24 antialiased">
      <div className="relative isolate px-4 sm:px-6 lg:px-8">
        {/* Background Gradient */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#8085ff] to-[#4f46e5] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        {/* Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-indigo-100/80 rounded-full border border-indigo-200/80">
                <Crown className="w-5 h-5 text-indigo-600" />
                <span className="text-indigo-800 text-sm font-bold tracking-wide">Premium Intelligence</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                Deep Scan Intelligence Report
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                AI-powered competitive analysis with live data and strategic insights to give you the winning edge.
            </p>
        </div>

        {/* Starting State */}
        {currentStatus === 'starting' && (
          <PanelCard className="p-8 sm:p-12 text-center flex flex-col items-center" highlight>
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                 <Hourglass className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Initiating Deep Scan...</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Connecting to our analysis engine and preparing the job. This should only take a moment.
            </p>
          </PanelCard>
        )}

        {/* Polling State (replaces old 'isDeepScanning') */}
        {currentStatus === 'polling' && (
          <PanelCard className="p-8 sm:p-12 text-center flex flex-col items-center" highlight>
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                 <Activity className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Analysis in Progress...</h3>
            <p className="text-gray-600 max-w-md mx-auto min-h-[40px] flex items-center justify-center">
              {currentMessage}
            </p>
            <ProgressBar progress={displayProgress} />
          </PanelCard>
        )}

        {/* Error State */}
        {currentStatus === 'error' && (
          <PanelCard className="p-8 sm:p-12 text-center flex flex-col items-center border-red-500/30">
             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                 <Frown className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-red-800 mb-2">Analysis Failed</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {deepScanError || 'An error occurred. This can happen due to network issues or restricted access to a site.'}
            </p>
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-all"
            >
              Retry Deep Scan
            </button>
          </PanelCard>
        )}
        
        {/* ================================================================================= */}
        {/* --- NEW V3 RESULTS VIEW --- */}
        {/* ================================================================================= */}
        {currentStatus === 'success' && finalData && (
          <div className="space-y-16">
            {/* Main Report (from Aura) */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-4">
                Strategic Battle Plan
              </h2>
              <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                This is the main strategic analysis generated by our lead AI agent, Aura. It provides a high-level overview of the competitive landscape.
              </p>
              <PanelCard className="p-8 prose prose-indigo max-w-none prose-p:text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-800 prose-li:text-gray-700">
                <ReactMarkdown>{finalData.analysis || "No main analysis was generated."}</ReactMarkdown>
                </PanelCard>
            </section>

            {/* Detailed Competitor Breakdown */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-4">
                Detailed Competitor Breakdown
              </h2>
              <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                Here's the granular data from our specialist agents for each competitor. Use the tabs to explore Technical, Content, and Visual UX reports.
              </p>
              <div className="space-y-8">
                {finalData.detailedAgentReports?.map((report, index) => (
                  <NewCompetitorCard key={report.url || index} report={report} />
                    ))}
                </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
