
import { saveCompareToLocalStorage } from "./utils";
import { useToast } from "@/hooks/use-toast";

// Add car to comparison
export const addToCompare = (
  carId: string, 
  compareCars: string[], 
  onSuccess: (newCompareCars: string[]) => void,
  onMaxLimitReached: () => void
) => {
  console.log("Adding to compare:", carId, "Current:", compareCars);
  
  if (!compareCars.includes(carId)) {
    if (compareCars.length < 3) {
      const newCompareCars = [...compareCars, carId];
      console.log("New compare cars list:", newCompareCars);
      saveCompareToLocalStorage(newCompareCars);
      onSuccess(newCompareCars);
      
      return {
        title: "Добавлено к сравнению",
        description: "Автомобиль добавлен к сравнению"
      };
    } else {
      onMaxLimitReached();
      
      return {
        variant: "destructive" as const,
        title: "Ограничение сравнения",
        description: "Можно сравнивать не более 3 автомобилей одновременно"
      };
    }
  }
  return null;
};

// Remove car from comparison
export const removeFromCompare = (
  carId: string, 
  compareCars: string[],
  onSuccess: (newCompareCars: string[]) => void
) => {
  console.log("Removing from compare:", carId, "Current:", compareCars);
  
  const newCompareCars = compareCars.filter(id => id !== carId);
  console.log("New compare cars list after removal:", newCompareCars);
  saveCompareToLocalStorage(newCompareCars);
  onSuccess(newCompareCars);
  
  return {
    title: "Удалено из сравнения",
    description: "Автомобиль удален из списка сравнения"
  };
};

// Clear all cars from comparison
export const clearCompare = (
  onSuccess: (newCompareCars: string[]) => void
) => {
  console.log("Clearing compare list");
  
  const emptyCompare: string[] = [];
  saveCompareToLocalStorage(emptyCompare);
  onSuccess(emptyCompare);
  
  return {
    title: "Список сравнения очищен",
    description: "Все автомобили удалены из списка сравнения"
  };
};
