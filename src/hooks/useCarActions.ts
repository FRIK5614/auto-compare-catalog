
import { useCars as useGlobalCars } from "../contexts/CarsContext";

export const useCarActions = () => {
  const {
    favorites = [], // Add default value
    compareCars = [], // Add default value
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

  // Utility functions for working with favorites and comparison
  const toggleFavorite = (carId: string) => {
    if (Array.isArray(favorites) && favorites.includes(carId)) {
      removeFromFavorites(carId);
    } else {
      addToFavorites(carId);
    }
  };

  const toggleCompare = (carId: string) => {
    if (Array.isArray(compareCars) && compareCars.includes(carId)) {
      removeFromCompare(carId);
    } else {
      addToCompare(carId);
    }
  };

  const isFavorite = (carId: string) => {
    return Array.isArray(favorites) && favorites.includes(carId);
  };

  const isInCompare = (carId: string) => {
    return Array.isArray(compareCars) && compareCars.includes(carId);
  };

  return {
    favorites,
    compareCarsIds: compareCars,
    toggleFavorite,
    toggleCompare,
    isFavorite,
    isInCompare,
    clearCompare,
    processOrder,
    getOrders,
    exportCarsData,
    importCarsData
  };
};
