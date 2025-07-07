import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { useAuth } from '@/contexts/AuthContext';

// helper to safely get ID token
async function getUserToken(user) {
  try {
    if (!user) return null;
    return await user.getIdToken();
  } catch (e) {
    console.error('Failed to get ID token', e);
    return null;
  }
}

// --- Polling Fetcher for SWR ---
// This function will be called by SWR every few seconds to check the job status.
const statusFetcher = async (url, token) => {
  if (!token) return { state: 'idle' }; // Don't fetch if there's no token.

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch analysis status.');
  }

  return res.json();
};

/**
 * Custom hook that performs deep scan flow with built-in credit check.
 * Returns helpers & state: { runDeepScan, data, error, isRunning }
 */
export default function useDeepScan() {
  const { user } = useAuth();
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, starting, polling, success, error
  const [progress, setProgress] = useState(0);
  const [finalData, setFinalData] = useState(null);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // --- SWR Hook for Polling ---
  // This will automatically poll the status endpoint when a `jobId` is available.
  const { data: statusData, error: pollingError } = useSWR(
    jobId && authToken ? [`/api/analysis-status/${jobId}`, authToken] : null,
    ([url, token]) => statusFetcher(url, token),
    {
      refreshInterval: 4000, // Poll every 4 seconds
      revalidateOnFocus: false,
    }
  );

  // --- Effect to handle Polling State Machine ---
  // This useEffect hook watches the data from the polling SWR hook and updates our state accordingly.
  useEffect(() => {
    if (pollingError) {
      setStatus('error');
      setError(pollingError.message);
      setJobId(null); // Stop polling on error
      return;
    }

    if (statusData) {
      setProgress(statusData.progress || 0);

      switch (statusData.state) {
        case 'completed':
          setStatus('success');
          setFinalData(statusData.result.data);
          setJobId(null); // Stop polling on completion
          break;
        case 'failed':
          setStatus('error');
          setError(statusData.error || 'The analysis job failed.');
          setJobId(null); // Stop polling on failure
          break;
        case 'active':
        case 'waiting':
          setStatus('polling');
          break;
        default:
          break;
      }
    }
  }, [statusData, pollingError]);

  // on user change fetch token
  useEffect(() => {
    (async () => {
      const tk = await getUserToken(user);
      setAuthToken(tk);
    })();
  }, [user]);

  // --- Main function to start the Deep Scan ---
  const runDeepScan = useCallback(async (params) => {
    const tk = authToken || await getUserToken(user);
    if (!tk) {
      setError('You must be logged in to perform a deep scan.');
      setStatus('error');
      return;
    }

    setStatus('starting');
    setError(null);
    setProgress(0);
    setFinalData(null);

    try {
      const res = await fetch('/api/deep-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tk}`,
        },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (res.status === 202 && data.jobId) {
        setJobId(data.jobId); // This will trigger the SWR polling to start
      } else {
        throw new Error(data.error || 'Failed to initialize the deep scan job.');
      }
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  }, [authToken, user]);

  return {
    runDeepScan,
    status,        // 'idle', 'starting', 'polling', 'success', 'error'
    progress,      // 0-100
    deepScanData: finalData,
    deepScanError: error,
    // A consolidated loading state for the UI
    isDeepScanning: status === 'starting' || status === 'polling',
  };
} 