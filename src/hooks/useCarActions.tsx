
import { useCars as useGlobalCars } from "../contexts/CarsContext";

export const useCarActions = () => {
  const {
    favorites,
    compareCars,
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
    if (favorites.includes(carId)) {
      removeFromFavorites(carId);
    } else {
      addToFavorites(carId);
    }
  };

  const toggleCompare = (carId: string) => {
    if (compareCars.includes(carId)) {
      removeFromCompare(carId);
    } else {
      addToCompare(carId);
    }
  };

  const isFavorite = (carId: string) => {
    return favorites.includes(carId);
  };

  const isInCompare = (carId: string) => {
    return compareCars.includes(carId);
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
