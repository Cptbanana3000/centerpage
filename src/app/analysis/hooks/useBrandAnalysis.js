import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Custom hook to load (or fetch) the analysis report for a given brand name / category.
 * Handles:
 *  – saved-report retrieval
 *  – fresh analysis call with progressive loading stages
 *  – cache-based URL replacement to ?view=saved
 *
 * @param {object} params
 * @param {string} params.brandName
 * @param {string} params.category
 * @param {string} params.viewMode        // "saved" | undefined
 * @param {firebase.User|null} params.user
 * @param {function} params.triggerHistoryRefresh  // callback from context
 * @param {import('next/navigation').Navigation} params.router
 */
export default function useBrandAnalysis({
  brandName,
  category = 'Technology',
  viewMode,
  user,
  triggerHistoryRefresh,
  router,
}) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStage, setLoadingStage] = useState(0);

  // internal refs for timer / duplicate requests
  const intervalRef = useRef(null);
  const isSubmittingRef = useRef(false);

  const loadingStages = useMemo(
    () => [
      'Initializing analysis...',
      'Analyzing domain availability...',
      'AI analyzing competitors...',
      'AI evaluating SEO difficulty...',
      'Generating strategic insights...',
      'Finalizing AI recommendations...',
    ],
    []
  );

  useEffect(() => {
    async function loadReport() {
      if (isSubmittingRef.current) {
        console.log('Duplicate analysis request prevented');
        return;
      }

      if (!brandName) {
        setError('No brand name provided');
        setLoading(false);
        return;
      }

      // reset state
      setAnalysis(null);
      setError(null);
      setLoading(true);
      setLoadingStage(0);

      // If viewing a saved report, hit the dedicated endpoint and bail
      if (viewMode === 'saved') {
        try {
          const token = await user?.getIdToken?.();
          const res = await fetch(
            `/api/view-report?brandName=${encodeURIComponent(brandName)}&category=${encodeURIComponent(
              category
            )}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            }
          );

          if (res.status === 204) {
            // No saved report yet; fall through to fresh analysis
          } else if (res.status === 404) {
            setError('Saved report not found. It may have been deleted or expired.');
            setLoading(false);
            return;
          }
          if (!res.ok) throw new Error('Failed to load saved report');

          const data = await res.json();
          setAnalysis(data);
          setLoading(false);
          return;
        } catch (err) {
          console.error('Error loading saved report:', err);
          setError('Failed to load saved report. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Attempt cached report first via same endpoint (without view=saved)
      try {
        const token = await user?.getIdToken?.();
        const cachedRes = await fetch(
          `/api/view-report?brandName=${encodeURIComponent(brandName)}&category=${encodeURIComponent(
            category
          )}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        );
        if (cachedRes.status === 204) {
          // No cached report; proceed to fresh analysis
        } else if (cachedRes.ok) {
          const cachedData = await cachedRes.json();
          setAnalysis(cachedData);
          setLoading(false);
          if (viewMode !== 'saved') {
            router?.replace?.(
              `/analysis?brand=${encodeURIComponent(brandName)}&category=${encodeURIComponent(
                category
              )}&view=saved`
            );
          }
          return;
        }
        // Gracefully handle 404 for new searches (expected behavior)
        if (cachedRes.status === 404) {
          // This is expected for new searches, no need to log or handle as error
          // Just continue to fresh analysis
        }
      } catch (err) {
        // ignore cache lookup errors and continue to fresh analysis
        // Only log unexpected errors, not 404s
        if (err.message && !err.message.includes('404')) {
          console.error('Unexpected cache lookup error:', err);
        }
      }

      // fresh analysis path
      isSubmittingRef.current = true;

      intervalRef.current = setInterval(() => {
        setLoadingStage((prev) => (prev < loadingStages.length - 1 ? prev + 1 : prev));
      }, 1500);

      try {
        const token = await user?.getIdToken?.();
        const res = await fetch(
          `/api/analyze?brandName=${encodeURIComponent(brandName)}&category=${encodeURIComponent(
            category
          )}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        );

        if (res.status === 403 || res.status === 402) {
          const data = await res.json();
          throw new Error(data.message);
        }
        if (!res.ok) throw new Error('Failed to analyze brand name');

        const data = await res.json();
        setAnalysis(data);
        if (user?.uid) triggerHistoryRefresh?.();
        if (viewMode !== 'saved') {
          router?.replace?.(
            `/analysis?brand=${encodeURIComponent(brandName)}&category=${encodeURIComponent(
              category
            )}&view=saved`
          );
        }
      } catch (err) {
        console.error('Analysis error:', err);
        setError(err.message || 'Failed to analyze brand name. Please try again.');
      } finally {
        if (intervalRef.current) clearInterval(intervalRef.current);
        isSubmittingRef.current = false;
        setLoading(false);
      }
    }

    if (brandName && user) {
      loadReport();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // The lock is now managed within the try/finally block, 
      // so we don't need to reset it on unmount.
    };
  }, [brandName, category, user, viewMode, router, triggerHistoryRefresh, loadingStages.length]);

  return { analysis, loading, error, loadingStage };
}