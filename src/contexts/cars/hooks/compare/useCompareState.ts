
import { useState, useEffect } from "react";
import { CompareState } from "./types";
import { loadCompareFromLocalStorage } from "../../utils";

export const useCompareState = (): CompareState => {
  const [compareCars, setCompareCars] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load compare cars from localStorage on initial mount
  useEffect(() => {
    const storedCompareCars = loadCompareFromLocalStorage();
    console.log("Loaded compare cars from localStorage:", storedCompareCars);
    setCompareCars(storedCompareCars);
    setLoading(false);
  }, []);

  return {
    compareCars,
    setCompareCars,
    loading,
    setLoading,
    isOnline: true // Default to true for compare functionality
  };
};
