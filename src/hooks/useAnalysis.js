// src/hooks/useAnalysis.js
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalysisHistory } from '@/contexts/AnalysisHistoryContext';

export function useAnalysis() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { triggerHistoryRefresh } = useAnalysisHistory();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBrandName, setNewBrandName] = useState('');
  const [newCategory, setNewCategory] = useState('Technology');
  const [isSearching, setIsSearching] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [deepScanData, setDeepScanData] = useState(null);
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  const [deepScanError, setDeepScanError] = useState(null);

  const intervalRef = useRef(null);
  const requestIdRef = useRef(null); // Track current request to prevent duplicates

  const brandName = searchParams.get('brand');
  const category = searchParams.get('category') || 'Technology';
  const viewMode = searchParams.get('view'); // 'saved' for viewing saved reports

  const categories = useMemo(() => [
    { value: 'tech & saas', label: '🖥️ Tech & SaaS' },
    { value: 'e-commerce & retail', label: '🛒 E-commerce & Retail' },
    { value: 'health & wellness', label: '🏥 Health & Wellness' },
    { value: 'creative & design', label: '🎨 Creative & Design' },
    { value: 'games & entertainment', label: '🎮 Games & Entertainment' },
    { value: 'finance & fintech', label: '💰 Finance & Fintech' },
    { value: 'food & beverage', label: '🍕 Food & Beverage' },
    { value: 'travel & hospitality', label: '✈️ Travel & Hospitality' },
    { value: 'education & e-learning', label: '📚 Education & E-learning' },
    { value: 'professional services', label: '🏢 Professional Services' }
  ], []);

  const loadingStages = useMemo(() => [
    'Initializing analysis...',
    'Analyzing domain availability...',
    'AI analyzing competitors...',
    'AI evaluating SEO difficulty...',
    'Generating strategic insights...',
    'Finalizing AI recommendations...'
  ], []);

  useEffect(() => {
    const loadReport = async () => {
      if (!brandName) {
        setError('No brand name provided');
        setLoading(false);
        return;
      }

      setAnalysis(null);
      setError(null);
      setLoading(true);
      setIsSearching(false);
      setLoadingStage(0);

      if (viewMode === 'saved') {
        try {
          const token = await user.getIdToken();
          const response = await fetch(`/api/view-report?brandName=${encodeURIComponent(brandName)}&category=${encodeURIComponent(category)}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (response.status === 404) {
            setError('Saved report not found. It may have been deleted or expired.');
            setLoading(false);
            return;
          }

          if (!response.ok) {
            throw new Error('Failed to load saved report');
          }

          const data = await response.json();
          const validatedData = {
            brandName: data.brandName || brandName,
            category: data.category || category,
            overallScore: data.overallScore || 0,
            recommendation: data.recommendation || 'No recommendation available.',
            scores: {
              domainStrength: data.scores?.domainStrength || 0,
              competitionIntensity: data.scores?.competitionIntensity || 0,
              seoDifficulty: data.scores?.seoDifficulty || 0,
              ...data.scores
            },
            detailedAnalysis: {
              domainAvailability: data.detailedAnalysis?.domainAvailability || [],
              googleCompetition: {
                topResults: data.detailedAnalysis?.googleCompetition?.topResults || [],
                ...data.detailedAnalysis?.googleCompetition
              },
              ...data.detailedAnalysis
            },
            cached: true,
            source: data.source || 'user_history',
            analysisTime: data.analysisTime || data.date || new Date().toISOString(),
            ...data
          };
          
          setAnalysis(validatedData);
          setLoading(false);
          return;
        } catch (err) {
          console.error('Error loading saved report:', err);
          setError('Failed to load saved report. Please try again.');
          setLoading(false);
          return;
        }
      }

      try {
        const token = await user.getIdToken();
        const cachedRes = await fetch(`/api/view-report?brandName=${encodeURIComponent(brandName)}&category=${encodeURIComponent(category)}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (cachedRes.ok) {
          const cachedData = await cachedRes.json();
          setAnalysis(cachedData);
          setLoading(false);
          if (viewMode !== 'saved') {
            router.replace(`/analysis?brand=${encodeURIComponent(brandName)}&category=${encodeURIComponent(category)}&view=saved`);
          }
          return;
        }
      } catch (err) {
        // Ignore and proceed to fresh analysis
      }

      const currentRequestId = `${brandName}_${category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      if (requestIdRef.current) {
        console.log('Canceling previous request to prevent duplicate');
        return;
      }
      
      requestIdRef.current = currentRequestId;

      intervalRef.current = setInterval(() => {
        setLoadingStage(prev => (prev < loadingStages.length - 1 ? prev + 1 : prev));
      }, 1500);

      try {
        const apiUrl = `/api/analyze?brandName=${encodeURIComponent(brandName)}&category=${encodeURIComponent(category)}`;
        const options = {};

        if (user) {
          const token = await user.getIdToken();
          options.headers = { 'Authorization': `Bearer ${token}` };
        } else {
          throw new Error('You must be logged in to perform an analysis.');
        }
        
        const response = await fetch(apiUrl, options);
        
        if (response.status === 403) {
           const data = await response.json();
           throw new Error(data.message || 'Please verify your email to continue.');
        }
        if (response.status === 402) {
           const data = await response.json();
           throw new Error(data.message || 'You have run out of credits.');
        }
        if (!response.ok) {
          throw new Error('Failed to analyze brand name');
        }

        const data = await response.json();
        
        if (intervalRef.current) clearInterval(intervalRef.current);
        setAnalysis(data);
        
        if (user?.uid) triggerHistoryRefresh();
        
        if (viewMode !== 'saved') {
          router.replace(`/analysis?brand=${encodeURIComponent(brandName)}&category=${encodeURIComponent(category)}&view=saved`);
        }
      } catch (err) {
        console.error('Analysis error:', err);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setError(err.message || 'Failed to analyze brand name. Please try again.');
      } finally {
        setLoading(false);
        requestIdRef.current = null;
      }
    };

    if (brandName && user) {
      loadReport();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (requestIdRef.current) requestIdRef.current = null;
    };
  }, [brandName, category, user?.uid, viewMode, router, triggerHistoryRefresh, loadingStages, user]);

  const handleNewSearch = async () => {
    if (!newBrandName.trim()) {
      alert('Please enter a brand name.');
      return;
    }
    setIsSearching(true);
    router.push(`/analysis?brand=${encodeURIComponent(newBrandName)}&category=${encodeURIComponent(newCategory)}`);
  };

  const handleDeepScan = async () => {
    if (!analysis?.brandName || !user) return;
    setIsDeepScanning(true);
    setDeepScanError(null);
    setDeepScanData(null);

    try {
        const token = await user.getIdToken();
        const res = await fetch('/api/deep-scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                brandName: analysis.brandName,
                competitors: analysis.detailedAnalysis.googleCompetition.topResults.slice(0, 5).map(c => c.link)
            })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Deep Scan failed.');
        }

        const data = await res.json();
        setDeepScanData(data);
        triggerHistoryRefresh(); // Refresh history to show deep scan status
    } catch (err) {
        console.error('Deep Scan error:', err);
        setDeepScanError(err.message);
    } finally {
        setIsDeepScanning(false);
    }
  };
  
  const handlePdfExport = async () => {
    if (!analysis) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reportData: analysis, deepScanData }),
      });

      if (!response.ok) {
        throw new Error('PDF export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${analysis.brandName}_VeritoLab_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Failed to export PDF', error);
      alert('Failed to export PDF. Please try again later.');
    }
  };

  return {
    analysis,
    loading,
    error,
    newBrandName,
    setNewBrandName,
    newCategory,
    setNewCategory,
    isSearching,
    loadingStage,
    deepScanData,
    isDeepScanning,
deepScanError,
    brandName,
    category,
    viewMode,
    categories,
    loadingStages,
    handleNewSearch,
    handleDeepScan,
    handlePdfExport,
  };
}
