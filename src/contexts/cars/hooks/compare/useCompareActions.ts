
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";
import { CompareState, CompareActions } from "./types";
import { saveCompareToLocalStorage } from "../../utils";

export const useCompareActions = (state: CompareState): CompareActions => {
  const { compareCars, setCompareCars } = state;
  const { toast } = useToast();

  // Add car to comparison
  const addToCompare = useCallback((carId: string): boolean => {
    console.log("Adding to compare:", carId, "Current state:", compareCars);
    
    if (compareCars.includes(carId)) {
      // Already in comparison list
      console.log("Car already in compare list");
      return false;
    }
    
    if (compareCars.length >= 3) {
      // Comparison limit reached
      console.log("Compare limit reached");
      toast({
        variant: "destructive",
        title: "Ограничение сравнения",
        description: "Можно сравнивать не более 3 автомобилей одновременно"
      });
      return false;
    }
    
    // Add to comparison list
    const newCompareCars = [...compareCars, carId];
    console.log("New compare list:", newCompareCars);
    setCompareCars(newCompareCars);
    saveCompareToLocalStorage(newCompareCars);
    
    toast({
      title: "Добавлено к сравнению",
      description: "Автомобиль добавлен к сравнению"
    });
    
    return true;
  }, [compareCars, setCompareCars, toast]);

  // Remove car from comparison
  const removeFromCompare = useCallback((carId: string): boolean => {
    console.log("Removing from compare:", carId, "Current state:", compareCars);
    
    const newCompareCars = compareCars.filter(id => id !== carId);
    console.log("New compare list after removal:", newCompareCars);
    setCompareCars(newCompareCars);
    saveCompareToLocalStorage(newCompareCars);
    
    toast({
      title: "Удалено из сравнения",
      description: "Автомобиль удален из списка сравнения"
    });
    
    return true;
  }, [compareCars, setCompareCars, toast]);

  // Clear all cars from comparison
  const clearCompare = useCallback((): boolean => {
    console.log("Clearing compare list");
    
    setCompareCars([]);
    saveCompareToLocalStorage([]);
    
    toast({
      title: "Список сравнения очищен",
      description: "Все автомобили удалены из списка сравнения"
    });
    
    return true;
  }, [setCompareCars, toast]);
  
  // Check if car is in comparison list
  const isInCompare = useCallback((carId: string): boolean => {
    return compareCars.includes(carId);
  }, [compareCars]);

  return {
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare
  };
};
