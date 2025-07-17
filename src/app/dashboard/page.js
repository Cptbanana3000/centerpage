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
import { Search, BarChart, ChevronRight, Star, Plus, CheckCircle, Microscope, Clock, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          type: item.type || 'standard_analysis',
          brandName: item.brandName,
          category: item.category,
          overallScore: item.overallScore,
          date: item.date?.toDate?.()?.toISOString() || item.analysisTime || new Date().toISOString(),
          // Deep scan specific fields
          jobId: item.jobId,
          scanState: item.scanState,
          competitorUrls: item.competitorUrls,
          hasReport: item.hasReport,
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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-600';
  };

  const getScanStateColor = (scanState) => {
    switch (scanState) {
      case 'completed': return 'text-green-600';
      case 'active': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getScanStateIcon = (scanState) => {
    switch (scanState) {
      case 'completed': return CheckCircle;
      case 'active': return Clock;
      case 'failed': return AlertCircle;
      default: return Clock;
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const filteredAnalyses = recentAnalyses.filter(analysis => 
    analysis.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const standardAnalyses = filteredAnalyses.filter(a => a.type !== 'deep_scan');
  const totalAnalyses = standardAnalyses.length;
  const averageScore = totalAnalyses > 0 ? Math.round(standardAnalyses.reduce((acc, curr) => acc + curr.overallScore, 0) / totalAnalyses) : 0;
  const topPicks = standardAnalyses.filter(a => a.overallScore >= 80).length;

  const StyledCard = ({ children, className = '' }) => (
    <div className={`bg-white border border-gray-200 rounded-xl ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="">
    <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900">Welcome Back,</h1>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200">
                  <span className="font-bold text-gray-700 truncate">{user?.email}</span>
                {user?.emailVerified && (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
            </div>
        </div>
          <p className="text-lg text-gray-600 mt-1">Ready to find your next breakthrough brand name?</p>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Main Content Area (Left Side) */}
        <div className="lg:col-span-3 flex flex-col gap-8">
            <StyledCard className="p-8 bg-gradient-to-br from-blue-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Start a New Analysis</h2>
              <p className="text-gray-600 mb-6">Your next great idea is one search away. Enter a brand name on the home page to begin.</p>
            <Link href="/" passHref>
                <Button size="lg" className="bg-gray-900 text-white font-bold hover:bg-gray-800">
                  <Plus className="w-5 h-5 mr-2" /> Launch
              </Button>
            </Link>
            </StyledCard>

          {/* Analysis History */}
            <StyledCard>
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-4 sm:mb-0 text-gray-900">Analysis History</h2>
              <div className="relative w-full sm:w-64">
                <Input
                  type="search"
                  placeholder="Search history..."
                    className="bg-gray-100 border-gray-300 pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
              <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                  <div className="text-center py-20"><div className="w-8 h-8 mx-auto border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div></div>
              ) : filteredAnalyses.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-2/5">Brand Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Date</TableHead>
                        <TableHead className="text-right">Score/Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAnalyses.map((analysis) => {
                        const isDeepScan = analysis.type === 'deep_scan';
                        const StateIcon = isDeepScan ? getScanStateIcon(analysis.scanState) : null;
                        
                        return (
                          <TableRow key={analysis.id} className="group">
                          <TableCell>
                              <div className="flex items-center gap-3">
                                {isDeepScan && <Microscope className="w-4 h-4 text-indigo-600" />}
                                <div>
                            <div className="font-semibold text-base text-gray-800 truncate">{analysis.brandName}</div>
                                  <div className="text-sm text-gray-500 flex items-center gap-1">
                                    {analysis.category}
                                    {isDeepScan && <span className="text-indigo-600 font-medium">• Deep Scan</span>}
                                  </div>
                                </div>
                              </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-gray-500">{formatDate(analysis.date)}</TableCell>
                            <TableCell className="text-right">
                              {isDeepScan ? (
                                <div className="flex items-center justify-end gap-2">
                                  <StateIcon className={`w-4 h-4 ${getScanStateColor(analysis.scanState)}`} />
                                  <span className={`text-sm font-medium ${getScanStateColor(analysis.scanState)}`}>
                                    {analysis.scanState === 'completed' ? 'Completed' : 
                                     analysis.scanState === 'active' ? 'Processing' : 'Failed'}
                                  </span>
                                </div>
                              ) : (
                                <span className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                                  {analysis.overallScore}
                                </span>
                              )}
                            </TableCell>
                          <TableCell>
                              <div className="flex items-center gap-2">
                                {isDeepScan && analysis.scanState === 'completed' ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.push(`/analysis?brand=${encodeURIComponent(analysis.brandName)}&category=${encodeURIComponent(analysis.category)}&view=saved`)}
                                    className="text-xs"
                                  >
                                    View Results
                                  </Button>
                                ) : !isDeepScan ? (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => router.push(`/analysis?brand=${encodeURIComponent(analysis.brandName)}&category=${encodeURIComponent(analysis.category)}&view=saved`)}
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                ) : null}
                              </div>
                          </TableCell>
                        </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-16 text-gray-500 px-4">
                    <p className="mb-2">No analyses found.</p>
                    {searchQuery && <p className="text-sm">Try clearing your search.</p>}
                    </div>
              )}
            </div>
            </StyledCard>
        </div>

        {/* Sidebar / Stats Area (Right Side) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
              <StyledCard className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Credits</h3>
              <CreditDisplay />
              </StyledCard>
              <StyledCard className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 text-lg text-gray-700"><BarChart className="w-5 h-5 text-gray-400" /><span>Average Score</span></div>
                    <span className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}</span>
                </div>
                 <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 text-lg text-gray-700"><Star className="w-5 h-5 text-yellow-400" /><span>Top Picks</span></div>
                      <span className="text-2xl font-bold text-green-500">{topPicks}</span>
                  </div>
                </div>
              </StyledCard>
              </div>
        </div>
      </div>
    </div>
  );
}
