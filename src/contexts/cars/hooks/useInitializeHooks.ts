
import { useRef, useState, useEffect } from "react";
import { Car, Order } from "@/types/car";
import { useCarsData } from "./useCarsData";
import { useFilters } from "./useFilters";
import { useFavorites } from "./useFavorites";
import { useCompare } from "./useCompare";
import { useCarsCRUD } from "./useCarsCRUD";
import { useOrders } from "./useOrders";
import { loadFavoritesFromLocalStorage, loadCompareFromLocalStorage } from "../utils";

export const useInitializeHooks = () => {
  // Ref for tracking initialization
  const isInitialized = useRef(false);
  const networkStatusChecked = useRef(false);
  
  // Use our custom hooks for different features
  const { 
    cars, 
    setCars, 
    orders: initialOrders, 
    setOrders: setInitialOrders, 
    favorites: initialFavorites, 
    setFavorites: setInitialFavorites, 
    loading, 
    error, 
    reloadCars: reloadCarsData,
    isOnline: dataIsOnline
  } = useCarsData();
  
  const { filter, setFilter, filteredCars } = useFilters(cars);
  
  const { 
    favorites,
    setFavorites,
    addToFavorites,
    removeFromFavorites,
    isOnline: favoritesIsOnline,
    refreshFavorites
  } = useFavorites();
  
  const { 
    compareCars,
    setCompareCars,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isOnline: compareIsOnline
  } = useCompare();
  
  const {
    viewCar,
    deleteCar,
    updateCar,
    addCar,
    uploadCarImage,
    importCarsData,
    exportCarsData,
    getCarById
  } = useCarsCRUD(cars);
  
  const {
    orders,
    setOrders,
    processOrder,
    getOrders,
    reloadOrders,
    isOnline: ordersIsOnline
  } = useOrders();

  // Check network status and handle online/offline events
  useEffect(() => {
    if (!networkStatusChecked.current) {
      networkStatusChecked.current = true;
      
      // Check initial network status
      const initialOnlineStatus = navigator.onLine;
      console.log(`Начальный статус сети: ${initialOnlineStatus ? 'онлайн' : 'офлайн'}`);
      
      // Synchronize data on load if we're online
      if (initialOnlineStatus) {
        // Fix: Call refreshFavorites without checking it
        refreshFavorites();
        
        // Always reload orders
        reloadOrders();
      }
    }
  }, [refreshFavorites, reloadOrders]);

  // Load favorites and comparison from localStorage if empty
  useEffect(() => {
    if (!isInitialized.current) {
      // Synchronize favorites
      if (initialFavorites.length > 0 && favorites.length === 0) {
        setFavorites(initialFavorites);
      } else if (favorites.length === 0) {
        const localFavorites = loadFavoritesFromLocalStorage();
        if (localFavorites.length > 0) {
          setFavorites(localFavorites);
        }
      }
      
      // Synchronize comparison
      if (compareCars.length === 0) {
        const localCompare = loadCompareFromLocalStorage();
        if (localCompare.length > 0) {
          setCompareCars(localCompare);
        }
      }
      
      // Synchronize orders
      if (initialOrders.length > 0 && orders.length === 0) {
        setOrders(initialOrders);
      }
      
      isInitialized.current = true;
    }
  }, [initialFavorites, favorites, compareCars, initialOrders, orders, setFavorites, setCompareCars, setOrders]);

  // Determine overall online status
  const isOnline = favoritesIsOnline && ordersIsOnline && compareIsOnline && dataIsOnline;

  // Wrap reloadCarsData to match the expected type in CarsContextType
  const reloadCars = async (): Promise<Car[]> => {
    return await reloadCarsData();
  };

  return {
    // State
    cars,
    filteredCars,
    favorites,
    compareCars,
    orders,
    loading,
    error,
    isOnline,
    filter,
    
    // State setters
    setFilter,
    
    // Favorites actions
    addToFavorites,
    removeFromFavorites,
    refreshFavorites,
    
    // Compare actions
    addToCompare,
    removeFromCompare,
    clearCompare,
    
    // Car CRUD
    getCarById,
    reloadCars,
    viewCar,
    deleteCar,
    updateCar,
    addCar,
    uploadCarImage,
    
    // Order operations
    processOrder,
    getOrders,
    reloadOrders,
    
    // Import/Export
    exportCarsData,
    importCarsData
  };
};
