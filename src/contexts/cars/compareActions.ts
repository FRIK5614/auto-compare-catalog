
import { saveCompareToLocalStorage } from "./utils";
import { useToast } from "@/hooks/use-toast";

// Add car to comparison
export const addToCompare = (
  carId: string, 
  compareCars: string[], 
  onSuccess: (newCompareCars: string[]) => void,
  onMaxLimitReached: () => void
) => {
  if (!compareCars.includes(carId)) {
    if (compareCars.length < 3) {
      const newCompareCars = [...compareCars, carId];
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
  const newCompareCars = compareCars.filter(id => id !== carId);
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
  const emptyCompare: string[] = [];
  saveCompareToLocalStorage(emptyCompare);
  onSuccess(emptyCompare);
  
  return {
    title: "Список сравнения очищен",
    description: "Все автомобили удалены из списка сравнения"
  };
};
