
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { addToCompare as addToCompareAction, removeFromCompare as removeFromCompareAction, clearCompare as clearCompareAction } from "../compareActions";
import { saveCompareToLocalStorage, loadCompareFromLocalStorage } from "../utils";

export const useCompare = () => {
  const [compareCars, setCompareCars] = useState<string[]>([]);
  const { toast } = useToast();

  // Initialize compare cars from localStorage with a limit
  useEffect(() => {
    const compareData = loadCompareFromLocalStorage();
    // Apply a hard limit of 3 cars to prevent performance issues
    const limitedCompareData = compareData.slice(0, 3);
    
    // If we had to limit the data, save the limited version back to localStorage
    if (limitedCompareData.length < compareData.length) {
      saveCompareToLocalStorage(limitedCompareData);
      console.log(`Limited compare cars from ${compareData.length} to ${limitedCompareData.length}`);
    }
    
    setCompareCars(limitedCompareData);
  }, []);

  // Save compare cars to localStorage whenever it changes
  useEffect(() => {
    saveCompareToLocalStorage(compareCars);
  }, [compareCars]);

  // Handle adding to compare
  const handleAddToCompare = (carId: string) => {
    const result = addToCompareAction(
      carId, 
      compareCars, 
      (newCompareCars) => setCompareCars(newCompareCars),
      () => toast({
        variant: "destructive",
        title: "Ограничение сравнения",
        description: "Можно сравнивать не более 3 автомобилей одновременно"
      })
    );
    
    if (result) {
      toast(result);
    }
  };

  // Handle removing from compare
  const handleRemoveFromCompare = (carId: string) => {
    const result = removeFromCompareAction(
      carId, 
      compareCars, 
      (newCompareCars) => setCompareCars(newCompareCars)
    );
    
    if (result) {
      toast(result);
    }
  };

  // Handle clearing compare
  const handleClearCompare = () => {
    const result = clearCompareAction(() => setCompareCars([]));
    
    if (result) {
      toast(result);
    }
  };

  return {
    compareCars,
    setCompareCars,
    addToCompare: handleAddToCompare,
    removeFromCompare: handleRemoveFromCompare,
    clearCompare: handleClearCompare
  };
};
