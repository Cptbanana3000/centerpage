// src/app/dashboard/page.js
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAnalysisHistory } from '@/contexts/AnalysisHistoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditDisplay } from '@/components/ui/CreditDisplay';
import databaseService from '@/services/database';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BarChart, ChevronRight, Star, Plus, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { refreshTrigger } = useAnalysisHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const fetchAnalysisHistory = async () => {
      try {
        setLoading(true);
        const historyData = await databaseService.getUserAnalysisHistory(user.uid);
        const transformedHistory = historyData.map(item => ({
          id: item.id,
          brandName: item.brandName,
          category: item.category,
          overallScore: item.overallScore,
          date: item.date?.toDate?.()?.toISOString() || item.analysisTime || new Date().toISOString(),
        }));
        setRecentAnalyses(transformedHistory);
      } catch (error) {
        console.error('Error fetching analysis history:', error);
        setRecentAnalyses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisHistory();
  }, [user, router, refreshTrigger]);

  if (!user) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const filteredAnalyses = recentAnalyses.filter(analysis => 
    analysis.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAnalyses = recentAnalyses.length;
  const averageScore = totalAnalyses > 0 ? Math.round(recentAnalyses.reduce((acc, curr) => acc + curr.overallScore, 0) / totalAnalyses) : 0;
  const topPicks = recentAnalyses.filter(a => a.overallScore >= 80).length;

  // Reusable card component for consistent styling
  const GlassCard = ({ children, className = '' }) => (
    <div className={`bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] backdrop-blur-lg rounded-xl ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Restored Welcome Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-white">Welcome Back,</h1>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(255,255,255,0.05)] border border-white/10">
                <span className="font-bold text-[#ccd6f6] truncate">{user?.email}</span>
                {user?.emailVerified && (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                )}
            </div>
        </div>
        <p className="text-lg text-[#8892b0] mt-1">Ready to find your next breakthrough brand name?</p>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Main Content Area (Left Side) */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <GlassCard className="p-8 bg-gradient-to-br from-[rgba(100,255,218,0.1)] to-transparent">
            <h2 className="text-2xl font-bold text-white mb-2">Start a New Analysis</h2>
            <p className="text-[#8892b0] mb-6">Your next great idea is one search away. Enter a brand name on the home page to begin.</p>
            <Link href="/" passHref>
              <Button size="lg" className="bg-[#64ffda] text-[#0a192f] font-bold hover:bg-white">
                  <Plus className="w-5 h-5 mr-2" /> Launch
              </Button>
            </Link>
          </GlassCard>

          {/* Analysis History */}
          <GlassCard>
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold mb-4 sm:mb-0">Analysis History</h2>
              <div className="relative w-full sm:w-64">
                <Input
                  type="search"
                  placeholder="Search history..."
                  className="bg-black/20 border-white/20 pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>
            
            <div className="flex flex-col">
              {loading ? (
                <div className="text-center py-20"><div className="w-8 h-8 mx-auto border-2 border-[#64ffda] border-t-transparent rounded-full animate-spin"></div></div>
              ) : filteredAnalyses.length > 0 ? (
                filteredAnalyses.map((analysis, index) => (
                  <Link href={`/analysis?brand=${encodeURIComponent(analysis.brandName)}&category=${encodeURIComponent(analysis.category)}&view=saved`} key={analysis.id} className={`grid grid-cols-2 sm:grid-cols-3 items-center px-6 py-5 transition-colors hover:bg-white/5 group ${index < filteredAnalyses.length - 1 ? 'border-b border-white/10' : ''}`}>
                    <div className="sm:col-span-1">
                      <div className="font-semibold text-lg text-[#ccd6f6] truncate">{analysis.brandName}</div>
                      <div className="text-sm text-[#8892b0]">{analysis.category}</div>
                    </div>
                    <div className="text-sm text-[#8892b0] hidden sm:block text-center">{formatDate(analysis.date)}</div>
                    <div className="flex items-center justify-end gap-4">
                      <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>{analysis.overallScore}</div>
                      <ChevronRight className="w-6 h-6 text-[#8892b0] opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-16 text-[#8892b0] px-4">No analyses found.</div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar / Stats Area (Right Side) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Your Credits</h3>
              <CreditDisplay />
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Key Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-lg"><BarChart className="w-5 h-5 text-[#8892b0]" /><span>Average Score</span></div>
                    <span className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-lg"><Star className="w-5 h-5 text-yellow-400" /><span>Top Picks</span></div>
                    <span className="text-2xl font-bold text-green-400">{topPicks}</span>
                </div>
              </div>
            </GlassCard>
        </div>
      </div>
    </div>
  );
}
