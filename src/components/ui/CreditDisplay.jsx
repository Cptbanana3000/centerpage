'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Microscope, Plus } from 'lucide-react';
import Link from 'next/link';

export function CreditDisplay({ variant = 'full', showRefill = true }) {
  const { user } = useAuth();
  const [credits, setCredits] = useState({ standardAnalyses: 0, deepScans: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/user-credits', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCredits(data);
        } else {
          console.error('Failed to fetch credits');
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [user]);

  if (loading) {
    return (
      <div className="animate-pulse flex items-center gap-4">
        <div className="h-4 bg-gray-300 rounded w-8"></div>
        <div className="h-4 bg-gray-300 rounded w-8"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-blue-500" />
          <span className="text-gray-900 font-medium">{credits.standardAnalyses}</span>
        </div>
        <div className="flex items-center gap-1">
          <Microscope className="w-4 h-4 text-purple-500" />
          <span className="text-gray-900 font-medium">{credits.deepScans}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Standard Analyses Credits */}
      <Card className="bg-gray-100 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Standard Analyses</span>
            </div>
            {showRefill && (
              <Link href="/#pricing">
                <button className="text-blue-500 hover:text-blue-600 text-xs transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </Link>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-900">{credits.standardAnalyses}</div>
          <p className="text-xs text-gray-500">Domain & competition checks</p>
        </CardContent>
      </Card>

      {/* Deep Scans Credits */}
      <Card className="bg-gray-100 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Microscope className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">Deep Scans</span>
            </div>
            {showRefill && (
              <Link href="/#pricing">
                <button className="text-purple-500 hover:text-purple-600 text-xs transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </Link>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-900">{credits.deepScans}</div>
          <p className="text-xs text-gray-500">AI analysis & PDF exports</p>
        </CardContent>
      </Card>
    </div>
  );
} 