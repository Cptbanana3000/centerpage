'use client'; // This is required for components that use React Hooks

import { useState, useRef } from 'react';
import { SignInDialog } from '@/components/auth/SignInDialog';
import { SignUpDialog } from '@/components/auth/SignUpDialog';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { PricingSection } from '@/components/pricing/PricingSection';

// --- Reusable UI Sub-Components (A Best Practice in React) ---
const MetricCircle = ({ score, label }) => {
    const scoreColor = score > 75 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500';
    const circumference = 2 * Math.PI * 45; // 2 * pi * r is approx 283
    const strokeDashoffset = circumference - (score / 100) * circumference;
    return (
        <div className="text-center flex flex-col items-center">
            <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}><circle className="text-slate-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" /><circle className={`progress-circle ${scoreColor}`} strokeWidth="8" strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" style={{ strokeDasharray: circumference, strokeDashoffset, transition: 'stroke-dashoffset 1.5s ease-out' }}/></svg>
                <span className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${scoreColor}`}>{score}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-600">{label}</p>
        </div>
    );
};

const KeyInsightCard = ({ insight }) => {
    const isPositive = insight.type === 'positive';
    const bgClass = isPositive ? 'insight-positive' : 'insight-negative';
    const iconClass = isPositive ? 'fas fa-check-circle text-green-600' : 'fas fa-exclamation-triangle text-red-600';
    const textColor = isPositive ? 'text-green-800' : 'text-red-800';
    return (
        <div className={`p-6 rounded-xl ${bgClass} hover:scale-105 transition-all duration-300`}><div className="flex justify-between items-start mb-3"><div className="flex items-center"><i className={`${iconClass} mr-2`}></i><h4 className="font-bold text-slate-800">{insight.title}</h4></div><span className={`font-bold text-sm ${textColor} bg-white/50 px-2 py-1 rounded-full`}>{insight.points}</span></div><p className="text-sm text-slate-700 leading-relaxed">{insight.description}</p></div>
    );
};

const DeepScanResults = ({ data }) => {
    // Helper function to format the AI analysis text into HTML
    const formatAIAnalysis = (analysis) => {
        if (!analysis) return '';
        return analysis
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
            .replace(/###\s(.*?)$/gm, '<h3 class="text-lg font-bold text-slate-800 mt-6 mb-3 border-l-4 border-purple-500 pl-4">$1</h3>')
            .replace(/•\s(.*?)$/gm, '<li class="flex items-start mb-2"><span class="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span><span class="text-slate-700">$1</span></li>')
            .replace(/\n/g, '<br />');
    };

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center"><i className="fas fa-chart-bar text-purple-600 mr-3"></i>Competitive Intelligence Report</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center"><div className="text-2xl font-bold text-purple-600">{data.competitors?.length || 0}</div><div className="text-sm text-slate-600">Competitors Analyzed</div></div>
                    <div className="text-center"><div className="text-2xl font-bold text-blue-600">{data.totalDataPoints || 0}</div><div className="text-sm text-slate-600">Data Points</div></div>
                    <div className="text-center"><div className="text-2xl font-bold text-emerald-600">{data.aiAnalyses?.length || 0}</div><div className="text-sm text-slate-600">AI Analyses</div></div>
                    <div className="text-center"><div className="text-2xl font-bold text-amber-600">{new Date(data.timestamp).toLocaleDateString()}</div><div className="text-sm text-slate-600">Generated</div></div>
                </div>
            </div>
            {data.aiAnalyses?.map((analysisItem) => (
                <div key={analysisItem.competitorUrl || Math.random()} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6"><h4 className="text-xl font-bold flex items-center"><i className="fas fa-robot mr-3"></i>AI Strategic Analysis for: <a href={analysisItem.competitorUrl} target="_blank" rel="noopener noreferrer" className="ml-2 hover:underline">{new URL(analysisItem.competitorUrl).hostname}</a></h4></div>
                    <div className="p-6 space-y-4" dangerouslySetInnerHTML={{ __html: formatAIAnalysis(analysisItem.analysis) }}></div>
                </div>
            ))}
        </div>
    );
};


// --- Main Page Component ---
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <PricingSection />
    </main>
  );
}
