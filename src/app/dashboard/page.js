// src/app/dashboard/page.js
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAnalysisHistory } from '@/contexts/AnalysisHistoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { CreditDisplay } from '@/components/ui/CreditDisplay';
import databaseService from '@/services/database';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BarChart, ChevronRight, Star, Plus, Filter, SortAsc } from 'lucide-react';

export default function DashboardPage() {
  const { user, logOut } = useAuth();
  const { refreshTrigger } = useAnalysisHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Redirect to home if not logged in and fetch user's analysis history
  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    // Fetch user's analysis history directly from database service
    const fetchAnalysisHistory = async () => {
      try {
        setLoading(true);
        
        // Use database service directly to bypass API issues
        const historyData = await databaseService.getUserAnalysisHistory(user.uid);
        
        // Transform the data to match expected format
        const transformedHistory = historyData.map(item => ({
          id: item.id,
          brandName: item.brandName,
          category: item.category,
          overallScore: item.overallScore,
          date: item.date?.toDate?.()?.toISOString() || item.analysisTime || new Date().toISOString(),
          scores: item.scores,
          recommendation: item.recommendation
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
  }, [user, router, refreshTrigger]); // Added refreshTrigger to dependencies

  if (!user) return null; // Render nothing while redirecting

  // Helper functions for styling and data
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const filteredAnalyses = recentAnalyses.filter(analysis => 
    analysis.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Key stats derived from user data
  const totalAnalyses = recentAnalyses.length;
  const averageScore = totalAnalyses > 0 ? Math.round(recentAnalyses.reduce((acc, curr) => acc + curr.overallScore, 0) / totalAnalyses) : 0;
  const topPicks = recentAnalyses.filter(a => a.overallScore >= 80).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16 sm:pt-20">
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span>Welcome Back, {user?.email}!</span>
            {user?.emailVerified && (
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </h1>
          <p className="text-base sm:text-lg text-gray-400">Ready to find your next breakthrough brand name?</p>
        </div>

        {/* Credits Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Your Credits</h2>
          <CreditDisplay />
        </div>

        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className="bg-white/5 border border-white/10 p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Average Score</CardTitle>
              <BarChart className="w-5 h-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl sm:text-4xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}</div>
              <p className="text-xs text-gray-500">Average viability of all names</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border border-white/10 p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Top Picks</CardTitle>
              <Star className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl font-bold text-green-400">{topPicks}</div>
              <p className="text-xs text-gray-500">Brands with high potential (Score &gt; 80)</p>
            </CardContent>
          </Card>
        </div>
        
        {/* New Analysis Section */}
        <div className="mb-8 sm:mb-12">
             <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-white/10 p-6 sm:p-8 text-center">
                <CardTitle className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Start a New Analysis</CardTitle>
                <CardDescription className="text-gray-400 mb-4 sm:mb-6 max-w-xl mx-auto text-sm sm:text-base">
                    Your next great idea is one search away. Enter a brand name and select its industry to begin.
                </CardDescription>
                <div className="flex justify-center">
                    <Link href="/" passHref>
                        <Button size="lg" className="bg-white text-gray-900 font-bold hover:bg-gray-200 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full group cursor-pointer">
                            Launch New Analysis <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>


        {/* Analysis History Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">Analysis History</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Input
                  type="search"
                  placeholder="Search history..."
                  className="bg-white/5 border-white/20 pl-10 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white flex-1 sm:flex-none text-xs sm:text-sm">
                  <Filter className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2"/>Filter
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white flex-1 sm:flex-none text-xs sm:text-sm">
                  <SortAsc className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2"/>Sort
                </Button>
              </div>
            </div>
          </div>
          
          {/* History Table */}
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-5 text-xs font-semibold text-gray-400 border-b border-white/10 px-6 py-3">
              <div>Brand Name</div>
              <div className="text-center">Category</div>
              <div className="text-center">Date</div>
              <div className="text-center">Overall Score</div>
              <div></div> {/* For action button */}
            </div>
            
            {loading ? (
                <div className="text-center py-8 sm:py-12">
                    <div className="w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-3 sm:mb-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-gray-400 text-sm sm:text-base">Loading your analysis history...</div>
                </div>
            ) : filteredAnalyses.length > 0 ? (
                filteredAnalyses.map((analysis) => (
                    <Link href={`/analysis?brand=${encodeURIComponent(analysis.brandName)}&category=${encodeURIComponent(analysis.category)}&view=saved`} key={analysis.id} className="block lg:grid lg:grid-cols-5 lg:items-center px-4 lg:px-6 py-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors group">
                        {/* Mobile/Tablet Layout */}
                        <div className="lg:hidden space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="font-semibold text-lg text-white flex-1 min-w-0">
                                    <div className="truncate">{analysis.brandName}</div>
                                </div>
                                <div className={`text-2xl font-bold flex-shrink-0 ${getScoreColor(analysis.overallScore)}`}>
                                    {analysis.overallScore}
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <span className="truncate flex-1 min-w-0">{analysis.category}</span>
                                <span className="flex-shrink-0 ml-2">{formatDate(analysis.date)}</span>
                            </div>
                            <div className="flex justify-end">
                                <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white text-sm">
                                    View Report <ChevronRight className="w-4 h-4 ml-1"/>
                                </Button>
                            </div>
                        </div>
                        
                        {/* Desktop Layout */}
                        <div className="hidden lg:contents">
                            <div className="font-semibold text-lg truncate pr-4">{analysis.brandName}</div>
                            <div className="text-center text-sm text-gray-400 truncate px-2">{analysis.category}</div>
                            <div className="text-center text-sm text-gray-400">{formatDate(analysis.date)}</div>
                            <div className={`text-center text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                                {analysis.overallScore}
                            </div>
                            <div className="text-right">
                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Report <ChevronRight className="w-4 h-4 ml-1"/>
                                </Button>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="text-center py-8 sm:py-12 text-gray-500 px-4">
                    <div className="text-sm sm:text-base">
                        {searchQuery ? 'No analyses found matching your search.' : 'No analysis history yet. Start by analyzing your first brand name!'}
                    </div>
                </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}