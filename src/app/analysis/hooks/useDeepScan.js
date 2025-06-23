import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

/**
 * Custom hook that performs deep scan flow with built-in credit check.
 * Returns helpers & state: { runDeepScan, data, error, isRunning }
 */
export default function useDeepScan({ user }) {
  const [error, setError] = useState(null);

  async function deepScanFetcher(url, { arg }) {
    const { brandName, category, competitorUrls } = arg;
    setError(null);
    if (!user) {
      throw new Error('Please log in to perform a deep scan.');
    }

    const token = await user.getIdToken();

    // Pre-flight credit check
    const creditResp = await fetch('/api/user-credits', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!creditResp.ok) throw new Error('Unable to verify credits.');
    const credits = await creditResp.json();
    if ((credits.deepScans || 0) <= 0) {
      throw new Error('Insufficient Deep Scan credits. Please purchase a credit pack to continue.');
    }

    // Proceed to deep scan
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ brandName, category, competitorUrls }),
    });

    const data = await res.json();

    if (res.status === 402 || res.status === 403) {
      throw new Error(data.message || 'Deep scan failed');
    }
    if (!data.success) {
      throw new Error(data.error || 'Deep scan failed.');
    }

    return data.data; // success payload
  }

  async function fetchCached(arg) {
    const { brandName, category } = arg;
    if (!user) return null;
    const token = await user.getIdToken();
    const res = await fetch(`/api/view-deep-report?brandName=${encodeURIComponent(brandName)}&category=${encodeURIComponent(category)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const j = await res.json();
      return j.data;
    }
    return null;
  }

  const { trigger, data, error: swrError, isMutating } = useSWRMutation('/api/deep-scan', deepScanFetcher);

  const [localData, setLocalData] = useState(null);

  return {
    deepScanData: localData || data || null,
    deepScanError: error || swrError?.message || null,
    isDeepScanning: isMutating,
    runDeepScan: async (params) => {
      // first attempt cached
      const cached = await fetchCached(params);
      if (cached) {
        setLocalData(cached);
        return cached;
      }
      return trigger(params).then(res=>{setLocalData(res); return res;}).catch((err) => setError(err.message));
    },
  };
} 