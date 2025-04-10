
import { Car } from "@/types/car";
import { useToast } from "@/hooks/use-toast";
import { useCars as useGlobalCars } from "../contexts/CarsContext";

export const useCarActions = (
  cars: Car[], 
  favorites: string[], 
  compareCars: string[]
) => {
  const { toast } = useToast();
  const { addToFavorites, removeFromFavorites, addToCompare, removeFromCompare } = useGlobalCars();

  // Проверка, является ли автомобиль избранным
  const isFavorite = (carId: string) => favorites.includes(carId);
  
  // Проверка, добавлен ли автомобиль к сравнению
  const isInCompare = (carId: string) => compareCars.includes(carId);
  
  // Переключение статуса избранного
  const toggleFavorite = (carId: string) => {
    if (favorites.includes(carId)) {
      removeFromFavorites(carId);
    } else {
      addToFavorites(carId);
    }
  };

  // Переключение статуса сравнения
  const toggleCompare = (carId: string) => {
    if (compareCars.includes(carId)) {
      removeFromCompare(carId);
    } else {
      if (compareCars.length >= 3) {
        toast({
          variant: "destructive",
          title: "Ограничение сравнения",
          description: "Можно сравнивать не более 3 автомобилей одновременно"
        });
        return;
      }
      addToCompare(carId);
    }
  };

  return {
    isFavorite,
    isInCompare,
    toggleFavorite,
    toggleCompare
  };
};
