
import { createContext, useContext, ReactNode } from "react";
import { CarsContextType } from "./types";
import { useCarsData } from "./hooks/useCarsData";
import { useFilters } from "./hooks/useFilters";
import { useFavorites } from "./hooks/useFavorites";
import { useCompare } from "./hooks/useCompare";
import { useCarsCRUD } from "./hooks/useCarsCRUD";
import { useOrders } from "./hooks/useOrders";

const CarsContext = createContext<CarsContextType | undefined>(undefined);

export const CarsProvider = ({ children }: { children: ReactNode }) => {
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
    reloadCars 
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
  } = useCarsCRUD();
  
  const {
    orders,
    setOrders,
    processOrder,
    getOrders
  } = useOrders();

  // Sync state between hooks
  if (initialFavorites.length > 0 && favorites.length === 0) {
    setFavorites(initialFavorites);
  }
  
  if (initialOrders.length > 0 && orders.length === 0) {
    setOrders(initialOrders);
  }

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
