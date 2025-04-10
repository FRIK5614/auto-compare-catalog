
import { useCars as useGlobalCars } from "../contexts/CarsContext";
import { useToast } from "@/hooks/use-toast";

export const useCarActions = () => {
  const {
    favorites = [], 
    compareCars = [], 
    addToFavorites,
    removeFromFavorites,
    addToCompare,
    removeFromCompare,
    clearCompare,
    processOrder,
    getOrders,
    exportCarsData,
    importCarsData
  } = useGlobalCars();
  
  const { toast } = useToast();

  // Utility functions for working with favorites and comparison
  const toggleFavorite = (carId: string) => {
    if (Array.isArray(favorites) && favorites.includes(carId)) {
      removeFromFavorites(carId);
      toast({
        title: "Удалено из избранного",
        description: "Автомобиль удален из списка избранного"
      });
    } else {
      addToFavorites(carId);
      toast({
        title: "Добавлено в избранное",
        description: "Автомобиль добавлен в список избранного"
      });
    }
  };

  const toggleCompare = (carId: string) => {
    if (Array.isArray(compareCars) && compareCars.includes(carId)) {
      removeFromCompare(carId);
      toast({
        title: "Удалено из сравнения",
        description: "Автомобиль удален из списка сравнения"
      });
    } else {
      // Check if we already have 3 cars in comparison
      if (compareCars.length >= 3) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Можно сравнивать не более 3 автомобилей одновременно"
        });
        return;
      }
      
      addToCompare(carId);
      toast({
        title: "Добавлено в сравнение",
        description: "Автомобиль добавлен в список сравнения"
      });
    }
  };

  const isFavorite = (carId: string) => {
    return Array.isArray(favorites) && favorites.includes(carId);
  };

  const isInCompare = (carId: string) => {
    return Array.isArray(compareCars) && compareCars.includes(carId);
  };

  const handleClearCompare = () => {
    clearCompare();
    toast({
      title: "Список сравнения очищен",
      description: "Все автомобили удалены из списка сравнения"
    });
  };

  return {
    favorites,
    compareCarsIds: compareCars,
    toggleFavorite,
    toggleCompare,
    isFavorite,
    isInCompare,
    clearCompare: handleClearCompare,
    processOrder,
    getOrders,
    exportCarsData,
    importCarsData
  };
};
