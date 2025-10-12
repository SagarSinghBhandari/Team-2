import React, { createContext, useContext, useState, useCallback } from 'react';

const AnalysisContext = createContext();

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

export const AnalysisProvider = ({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [previousAnalysis, setPreviousAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateAnalysis = useCallback((analysisData) => {
    if (currentAnalysis) {
      setPreviousAnalysis(currentAnalysis);
    }
    setCurrentAnalysis(analysisData);
  }, [currentAnalysis]);

  const resetAnalysis = useCallback(() => {
    setCurrentAnalysis(null);
    setPreviousAnalysis(null);
    setError(null);
  }, []);

  const value = {
    currentAnalysis,
    previousAnalysis,
    isLoading,
    error,
    updateAnalysis,
    resetAnalysis,
    setIsLoading,
    setError
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};
