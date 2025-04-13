
import { useState, useEffect } from "react";
import { loadCompareFromSupabase } from "../../utils";

export const useCompareState = () => {
  const [compareCars, setCompareCars] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial compare list
  useEffect(() => {
    const loadInitialCompare = async () => {
      try {
        setLoading(true);
        const initialCompare = await loadCompareFromSupabase();
        setCompareCars(initialCompare);
      } catch (error) {
        console.error("Error loading comparison list:", error);
        setCompareCars([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialCompare();
  }, []);

  return {
    compareCars,
    setCompareCars,
    loading,
    setLoading
  };
};
