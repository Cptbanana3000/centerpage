'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const AnalysisHistoryContext = createContext({});

export const AnalysisHistoryProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger a refresh of analysis history
  const triggerHistoryRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <AnalysisHistoryContext.Provider value={{
      refreshTrigger,
      triggerHistoryRefresh
    }}>
      {children}
    </AnalysisHistoryContext.Provider>
  );
};

export const useAnalysisHistory = () => {
  const context = useContext(AnalysisHistoryContext);
  if (!context) {
    throw new Error('useAnalysisHistory must be used within an AnalysisHistoryProvider');
  }
  return context;
}; 