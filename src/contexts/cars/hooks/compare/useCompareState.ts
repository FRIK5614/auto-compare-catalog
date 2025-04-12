
import { useState, useEffect } from "react";
import { CompareState } from "./types";
import { loadCompareFromLocalStorage } from "../../utils";

export const useCompareState = (): CompareState => {
  const [compareCars, setCompareCars] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const compareData = loadCompareFromLocalStorage();
      // Apply hard limit of 3 cars to prevent performance issues
      const limitedCompareData = compareData.slice(0, 3);
      setCompareCars(limitedCompareData);
    } catch (error) {
      console.error("Error loading comparison list:", error);
      setCompareCars([]);
    }
  }, []);

  return {
    compareCars,
    loading,
    isOnline,
    setCompareCars,
    setLoading
  };
};
