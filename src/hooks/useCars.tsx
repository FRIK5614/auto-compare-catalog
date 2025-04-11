import { useEffect, useRef } from "react";
import { useCarDetails } from "./useCarDetails";
import { useCarFiltering } from "./useCarFiltering";
import { useCarActions } from "./useCarActions";
import { useCarsState } from "./useCarsState";
import { useCars as useGlobalCars } from "../contexts/CarsContext";

export const useCars = () => {
  const { 
    compareCars, 
    clearCompare, 
    processOrder, 
    getOrders, 
    exportCarsData, 
    importCarsData,
    orders: contextOrders,
    reloadOrders
  } = useGlobalCars();
  
  const carDetails = useCarDetails();
  const carFiltering = useCarFiltering();
  const carActions = useCarActions();
  const carsState = useCarsState();
  
  // Use ref for tracking first initialization
  const initialFilterApplied = useRef(false);

  // Initialize filters for home page only once
  useEffect(() => {
    if (!initialFilterApplied.current && carFiltering.filter && !carFiltering.filter.limit && window.location.pathname === '/') {
      initialFilterApplied.current = true;
      carFiltering.setFilter({
        ...carFiltering.filter,
        limit: 24
      });
    }
  }, [carFiltering.filter, carFiltering.setFilter]);

  // Combine all hooks into a unified API
  return {
    // Car data and state
    cars: carsState.cars,
    loading: carsState.loading,
    error: carsState.error,
    filteredCars: carFiltering.filteredCars,
    favoriteCars: carsState.favoriteCars,
    comparisonCars: carsState.comparisonCars,
    compareCarsIds: compareCars,
    orders: carsState.orders,
    
    // Filtering
    filter: carFiltering.filter,
    setFilter: carFiltering.setFilter,
    
    // Favorite and compare actions
    toggleFavorite: carActions.toggleFavorite,
    toggleCompare: carActions.toggleCompare,
    isFavorite: carActions.isFavorite,
    isInCompare: carActions.isInCompare,
    clearCompare,
    
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
    
    // Order operations
    processOrder,
    getOrders,
    reloadOrders,
    
    // Other actions
    exportCarsData,
    importCarsData,
    uploadCarImage: carDetails.uploadCarImage,
    
    // Added for compatibility with components that require these functions
    removeFromFavorites: carsState.removeFromFavorites,
    removeFromCompare: carsState.removeFromCompare
  };
};
