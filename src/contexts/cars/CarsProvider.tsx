
import { createContext, useContext, ReactNode, useRef, useEffect } from "react";
import { CarsContextType } from "./types";
import { useCarsData } from "./hooks/useCarsData";
import { useFilters } from "./hooks/useFilters";
import { useFavorites } from "./hooks/useFavorites";
import { useCompare } from "./hooks/useCompare";
import { useCarsCRUD } from "./hooks/useCarsCRUD";
import { useOrders } from "./hooks/useOrders";
import { loadFavoritesFromLocalStorage, loadCompareFromLocalStorage } from "./utils";
import { Car } from "@/types/car";

const CarsContext = createContext<CarsContextType | undefined>(undefined);

export const CarsProvider = ({ children }: { children: ReactNode }) => {
  // Ref for tracking initialization
  const isInitialized = useRef(false);
  
  // Use our custom hooks
  const { 
    cars, 
    setCars, 
    orders: initialOrders, 
    setOrders: setInitialOrders, 
    favorites: initialFavorites, 
    setFavorites: setInitialFavorites, 
    loading, 
    error, 
    reloadCars: reloadCarsData
  } = useCarsData();
  
  const { filter, setFilter, filteredCars } = useFilters(cars);
  
  const { 
    favorites,
    setFavorites,
    addToFavorites,
    removeFromFavorites
  } = useFavorites();
  
  const { 
    compareCars,
    setCompareCars,
    addToCompare,
    removeFromCompare,
    clearCompare
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
    reloadOrders
  } = useOrders();

  // Load initial favorites and compare from localStorage if empty
  useEffect(() => {
    if (!isInitialized.current) {
      // Sync favorites
      if (initialFavorites.length > 0 && favorites.length === 0) {
        setFavorites(initialFavorites);
      } else if (favorites.length === 0) {
        const localFavorites = loadFavoritesFromLocalStorage();
        if (localFavorites.length > 0) {
          setFavorites(localFavorites);
        }
      }
      
      // Sync compare
      if (compareCars.length === 0) {
        const localCompare = loadCompareFromLocalStorage();
        if (localCompare.length > 0) {
          setCompareCars(localCompare);
        }
      }
      
      // Sync orders
      if (initialOrders.length > 0 && orders.length === 0) {
        setOrders(initialOrders);
      }
      
      isInitialized.current = true;
    }
  }, [initialFavorites, favorites, compareCars, initialOrders, orders, setFavorites, setCompareCars, setOrders]);

  // Wrap reloadCarsData to match the expected return type in CarsContextType
  const reloadCars = async (): Promise<Car[]> => {
    await reloadCarsData();
    return cars;
  };

  return (
    <CarsContext.Provider
      value={{
        cars,
        filteredCars,
        favorites,
        compareCars,
        orders,
        loading,
        error,
        filter,
        setFilter,
        addToFavorites,
        removeFromFavorites,
        addToCompare,
        removeFromCompare,
        clearCompare,
        getCarById,
        reloadCars,
        viewCar,
        deleteCar,
        updateCar,
        addCar,
        processOrder,
        getOrders,
        reloadOrders,
        exportCarsData,
        importCarsData,
        uploadCarImage
      }}
    >
      {children}
    </CarsContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarsContext);
  if (context === undefined) {
    throw new Error("useCars must be used within a CarsProvider");
  }
  return context;
};
