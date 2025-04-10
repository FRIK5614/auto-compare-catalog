
import { useEffect } from "react";
import { useCarDetails } from "./useCarDetails";
import { useCarFiltering } from "./useCarFiltering";
import { useCarActions } from "./useCarActions";
import { useCarsState } from "./useCarsState";

export const useCars = () => {
  const carDetails = useCarDetails();
  const carFiltering = useCarFiltering();
  const carActions = useCarActions();
  const carsState = useCarsState();

  // Initialize filters for home page
  useEffect(() => {
    if (carFiltering.filter && !carFiltering.filter.limit && window.location.pathname === '/') {
      carFiltering.setFilter({
        ...carFiltering.filter,
        limit: 24
      });
    }
  }, [carFiltering.filter, carFiltering.setFilter]);

  // Combine all the hooks into a single API
  return {
    // Car data and state
    cars: carsState.cars,
    loading: carsState.loading,
    error: carsState.error,
    filteredCars: carFiltering.filteredCars,
    favoriteCars: carsState.favoriteCars,
    comparisonCars: carsState.comparisonCars,
    compareCarsIds: carActions.compareCarsIds,
    orders: carsState.orders,
    
    // Filtering
    filter: carFiltering.filter,
    setFilter: carFiltering.setFilter,
    
    // Favorite and compare actions
    toggleFavorite: carActions.toggleFavorite,
    toggleCompare: carActions.toggleCompare,
    isFavorite: carActions.isFavorite,
    isInCompare: carActions.isInCompare,
    clearCompare: carActions.clearCompare,
    
    // Car CRUD operations
    getCarById: carDetails.getCarById,
    reloadCars: carDetails.reloadCars,
    viewCar: carDetails.viewCar,
    deleteCar: carDetails.deleteCar,
    updateCar: carDetails.updateCar,
    addCar: carDetails.addCar,
    
    // Filter utilities
    getMostViewedCars: carFiltering.getMostViewedCars,
    getUniqueValues: carFiltering.getUniqueValues,
    getPriceRange: carFiltering.getPriceRange,
    getYearRange: carFiltering.getYearRange,
    applySorting: carFiltering.applySorting,
    applyAdvancedFilter: carFiltering.applyAdvancedFilter,
    
    // Other actions
    processOrder: carActions.processOrder,
    getOrders: carActions.getOrders,
    exportCarsData: carActions.exportCarsData,
    importCarsData: carActions.importCarsData,
    uploadCarImage: carDetails.uploadCarImage,
    
    // Added for compatibility with components that require these functions
    removeFromFavorites: carsState.removeFromFavorites,
    removeFromCompare: carsState.removeFromCompare
  };
};
