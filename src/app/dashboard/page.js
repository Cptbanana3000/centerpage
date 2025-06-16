// src/app/dashboard/page.js
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAnalysisHistory } from '@/contexts/AnalysisHistoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BarChart, ChevronRight, Star, Plus, Filter, SortAsc } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
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

    // Fetch user's analysis history from the API
    const fetchAnalysisHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/history?userId=${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          setRecentAnalyses(data.history || []);
        } else {
          console.error('Failed to fetch analysis history');
          setRecentAnalyses([]);
        }
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Verito
          </Link>
          <div className="flex items-center gap-4  ">
            <Button variant="ghost" onClick={logout} className="cursor-pointer">Sign Out</Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-lg font-bold">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome Back, {user?.email}!</h1>
          <p className="text-lg text-gray-400">Ready to find your next breakthrough brand name?</p>
        </div>

        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/5 border border-white/10 p-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Analyses</CardTitle>
              <BarChart className="w-5 h-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalAnalyses}</div>
              <p className="text-xs text-gray-500">Analyses performed</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border border-white/10 p-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Average Score</CardTitle>
              <BarChart className="w-5 h-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}</div>
              <p className="text-xs text-gray-500">Average viability of all names</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border border-white/10 p-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Top Picks</CardTitle>
              <Star className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-400">{topPicks}</div>
              <p className="text-xs text-gray-500">Brands with high potential (Score &gt; 80)</p>
            </CardContent>
          </Card>
        </div>
        
        {/* New Analysis Section */}
        <div className="mb-12">
             <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-white/10 p-8 text-center">
                <CardTitle className="text-2xl font-bold mb-4">Start a New Analysis</CardTitle>
                <CardDescription className="text-gray-400 mb-6 max-w-xl mx-auto">
                    Your next great idea is one search away. Enter a brand name and select its industry to begin.
                </CardDescription>
                <div className="flex justify-center">
                    <Link href="/" passHref>
                        <Button size="lg" className="bg-white text-gray-900 font-bold hover:bg-gray-200 text-lg px-8 py-6 rounded-full group cursor-pointer">
                            Launch New Analysis <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>


        {/* Analysis History Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Analysis History</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Input
                  type="search"
                  placeholder="Search history..."
                  className="bg-white/5 border-white/20 pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white"><Filter className="w-4 h-4 mr-2"/>Filter</Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white"><SortAsc className="w-4 h-4 mr-2"/>Sort</Button>
            </div>
          </div>
          
          {/* History Table */}
          <div className="bg-white/5 border border-white/10 rounded-lg">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-5 text-xs font-semibold text-gray-400 border-b border-white/10 px-6 py-3">
              <div>Brand Name</div>
              <div className="text-center">Category</div>
              <div className="text-center">Date</div>
              <div className="text-center">Overall Score</div>
              <div></div> {/* For action button */}
            </div>
            
            {loading ? (
                <div className="text-center py-12">
                    <div className="w-8 h-8 mx-auto mb-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-gray-400">Loading your analysis history...</div>
                </div>
            ) : filteredAnalyses.length > 0 ? (
                filteredAnalyses.map((analysis) => (
                    <Link href={`/analysis?brand=${analysis.brandName}&category=${encodeURIComponent(analysis.category)}`} key={analysis.id} className="block md:grid md:grid-cols-5 md:items-center px-4 md:px-6 py-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors group">
                        {/* Mobile Layout */}
                        <div className="md:hidden space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="font-semibold text-lg text-white">{analysis.brandName}</div>
                                <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                                    {analysis.overallScore}
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <span>{analysis.category}</span>
                                <span>{formatDate(analysis.date)}</span>
                            </div>
                            <div className="flex justify-end">
                                <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                                    View Report <ChevronRight className="w-4 h-4 ml-1"/>
                                </Button>
                            </div>
                        </div>
                        
                        {/* Desktop Layout */}
                        <div className="hidden md:contents">
                            <div className="font-semibold text-lg">{analysis.brandName}</div>
                            <div className="text-center text-sm text-gray-400">{analysis.category}</div>
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
                <div className="text-center py-12 text-gray-500">
                    {searchQuery ? 'No analyses found matching your search.' : 'No analysis history yet. Start by analyzing your first brand name!'}
                </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
