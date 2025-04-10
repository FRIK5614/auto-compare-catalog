
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { addToCompare as addToCompareAction, removeFromCompare as removeFromCompareAction, clearCompare as clearCompareAction } from "../compareActions";
import { saveCompareToLocalStorage, loadCompareFromLocalStorage } from "../utils";

export const useCompare = () => {
  const [compareCars, setCompareCars] = useState<string[]>([]);
  const { toast } = useToast();

  // Initialize compare cars from localStorage
  useEffect(() => {
    const compareData = loadCompareFromLocalStorage();
    setCompareCars(compareData);
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
