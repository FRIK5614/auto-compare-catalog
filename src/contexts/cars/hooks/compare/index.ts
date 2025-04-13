
import { useCompareState } from "./useCompareState";
import { useCompareActions } from "./useCompareActions";
import { UseCompareReturn } from "./types";
import { useEffect } from "react";
import { useNetworkStatus } from "../useNetworkStatus";

export const useCompare = (): UseCompareReturn => {
  // Get state (with loading state)
  const { compareCars, setCompareCars, loading, setLoading } = useCompareState();
  
  // Get network status
  const { isOnline } = useNetworkStatus();
  
  // Get actions
  const actions = useCompareActions({
    compareCars,
    setCompareCars,
    loading,
    isOnline,
    setLoading
  });
  
  // Mark as loaded after initial load
  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [loading, setLoading]);

  // Combine state and actions
  return {
    ...actions,
    compareCars,
    setCompareCars,
    loading,
    isOnline,
    setLoading
  };
};
