'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // If user is not authenticated, don't render the dashboard
  if (!user) {
    return null;
  }

  // Example data - this would come from your backend in a real implementation
  const recentAnalyses = [
    {
      id: 1,
      brandName: 'veritolab',
      overallScore: 92,
      date: '2024-03-20T10:30:00',
      domainScore: 95,
      seoScore: 88,
      competitionScore: 93,
      status: 'completed',
      category: 'Technology'
    },
    {
      id: 2,
      brandName: 'techflow',
      overallScore: 75,
      date: '2024-03-19T15:45:00',
      domainScore: 70,
      seoScore: 80,
      competitionScore: 75,
      status: 'completed',
      category: 'SaaS'
    },
    {
      id: 3,
      brandName: 'innovatex',
      overallScore: 45,
      date: '2024-03-18T09:15:00',
      domainScore: 40,
      seoScore: 50,
      competitionScore: 45,
      status: 'completed',
      category: 'Startup'
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500/10';
    if (score >= 60) return 'bg-amber-500/10';
    return 'bg-red-500/10';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate average score
  const averageScore = Math.round(
    recentAnalyses.reduce((acc, curr) => acc + curr.overallScore, 0) / recentAnalyses.length
  );

  // Count strong contenders (score >= 80)
  const strongContenders = recentAnalyses.filter(a => a.overallScore >= 80).length;

  // Filter analyses based on search query
  const filteredAnalyses = recentAnalyses.filter(analysis => 
    analysis.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-white to-[#764ba2]/5">
      {/* Header */}
      <header className="border-b border-[#667eea]/10 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">veritolab</div>
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search brand names..."
                  className="w-[300px] bg-white/50 border-[#667eea]/20 focus:border-[#667eea]/40 focus:ring-[#667eea]/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#667eea] hover:text-[#764ba2]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-medium">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-[#667eea]">{user?.email}</span>
              </div>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-[#667eea] hover:text-[#764ba2]"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Column - Analysis History (2/3 width) */}
          <div className="w-2/3">
            {/* Recent Analyses Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Recent Analyses</h2>
                  <p className="text-sm text-[#667eea]/70 mt-1">Track and manage your brand analyses</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="text-[#667eea] border-[#667eea]/20 hover:bg-[#667eea]/5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="text-[#667eea] border-[#667eea]/20 hover:bg-[#667eea]/5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Sort
                  </Button>
                </div>
              </div>
              
              {/* Analysis Report Cards */}
              <div className="space-y-4">
                {filteredAnalyses.map((analysis) => (
                  <Link 
                    href={`/analysis/${analysis.id}`} 
                    key={analysis.id}
                    className="block"
                  >
                    <Card className="p-6 bg-white/50 backdrop-blur-sm border-[#667eea]/10 shadow-[4px_4px_10px_rgba(102,126,234,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_15px_rgba(102,126,234,0.1),-6px_-6px_15px_rgba(255,255,255,0.9)] transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          {/* Viability Score Circle */}
                          <div className="relative w-16 h-16">
                            <svg className="w-full h-full" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                              <circle 
                                className="text-slate-200" 
                                strokeWidth="8" 
                                stroke="currentColor" 
                                fill="transparent" 
                                r="45" 
                                cx="50" 
                                cy="50" 
                              />
                              <circle 
                                className={getScoreColor(analysis.overallScore)}
                                strokeWidth="8" 
                                strokeLinecap="round" 
                                stroke="currentColor" 
                                fill="transparent" 
                                r="45" 
                                cx="50" 
                                cy="50" 
                                style={{ 
                                  strokeDasharray: 283,
                                  strokeDashoffset: 283 - (analysis.overallScore / 100) * 283,
                                  transition: 'stroke-dashoffset 1.5s ease-out'
                                }}
                              />
                            </svg>
                            <span className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                              {analysis.overallScore}
                            </span>
                          </div>
                          
                          {/* Brand Info */}
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-xl font-semibold text-[#667eea] group-hover:text-[#764ba2] transition-colors">{analysis.brandName}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBgColor(analysis.overallScore)} ${getScoreColor(analysis.overallScore)}`}>
                                {analysis.category}
                              </span>
                            </div>
                            <p className="text-sm text-[#667eea]/70">{formatDate(analysis.date)}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-[#667eea]/70"
                                >
                                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                                <span className="text-xs text-[#667eea]/70">Domain: {analysis.domainScore}%</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-[#667eea]/70"
                                >
                                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                                <span className="text-xs text-[#667eea]/70">SEO: {analysis.seoScore}%</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-[#667eea]/70"
                                >
                                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                                <span className="text-xs text-[#667eea]/70">Competition: {analysis.competitionScore}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* View Report Button */}
                        <Button 
                          variant="outline" 
                          className="text-[#667eea] border-[#667eea]/20 hover:bg-[#667eea]/5 group-hover:border-[#764ba2]/20 group-hover:text-[#764ba2] transition-colors"
                        >
                          View Full Report
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-2 group-hover:translate-x-1 transition-transform"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </Button>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar (1/3 width) */}
          <div className="w-1/3">
            <div className="space-y-6">
              {/* Subscription Status Widget */}
              <Card className="p-6 bg-white/50 backdrop-blur-sm border-[#667eea]/10 shadow-[4px_4px_10px_rgba(102,126,234,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#667eea]">Free Plan</h3>
                      <p className="text-sm text-[#667eea]/70">3 of 5 analyses used</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#667eea]"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-[#667eea]/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full transition-all duration-500"
                      style={{ width: '60%' }}
                    />
                  </div>

                  {/* Upgrade Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:from-[#5a67d8] hover:to-[#6b46c1] transition-all duration-300 group"
                  >
                    Upgrade to Pro
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Button>

                  {/* Pro Benefits */}
                  <div className="space-y-2 text-sm text-[#667eea]/70">
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#667eea]"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>Unlimited brand analyses</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#667eea]"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>Save and compare reports</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#667eea]"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>Deep market analysis</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Stats Widget */}
              <Card className="p-6 bg-white/50 backdrop-blur-sm border-[#667eea]/10 shadow-[4px_4px_10px_rgba(102,126,234,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)]">
                <h3 className="text-lg font-semibold text-[#667eea] mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#667eea]/70">Total Analyses</span>
                    <span className="font-medium text-[#667eea]">{recentAnalyses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#667eea]/70">Average Score</span>
                    <span className="font-medium text-[#667eea]">{averageScore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#667eea]/70">Strong Contenders</span>
                    <span className="font-medium text-[#667eea]">{strongContenders}</span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions Widget */}
              <Card className="p-6 bg-white/50 backdrop-blur-sm border-[#667eea]/10 shadow-[4px_4px_10px_rgba(102,126,234,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)]">
                <h3 className="text-lg font-semibold text-[#667eea] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-[#667eea] border-[#667eea]/20 hover:bg-[#667eea]/5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    New Analysis
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-[#667eea] border-[#667eea]/20 hover:bg-[#667eea]/5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                    Saved Reports
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-[#667eea] border-[#667eea]/20 hover:bg-[#667eea]/5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export Data
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 