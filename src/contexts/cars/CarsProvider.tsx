
import { createContext, useContext, ReactNode } from "react";
import { CarsContextType } from "./types";
import { 
  createViewCarAdapter,
  createUpdateCarAdapter,
  createAddCarAdapter,
  createExportCarsDataAdapter,
  createImportCarsDataAdapter,
  createUploadCarImageAdapter
} from "./adapters/contextAdapters";
import { useInitializeHooks } from "./hooks/useInitializeHooks";

const CarsContext = createContext<CarsContextType | undefined>(undefined);

export const CarsProvider = ({ children }: { children: ReactNode }) => {
  // Use our custom hook to initialize all the required hooks
  const {
    cars,
    filteredCars,
    favorites,
    compareCars,
    orders,
    loading,
    error,
    isOnline,
    filter,
    setFilter,
    addToFavorites,
    removeFromFavorites,
    refreshFavorites,
    addToCompare: originalAddToCompare,
    removeFromCompare: originalRemoveFromCompare,
    clearCompare,
    getCarById,
    reloadCars,
    viewCar,
    deleteCar,
    updateCar,
    addCar,
    uploadCarImage,
    processOrder,
    getOrders,
    reloadOrders,
    exportCarsData,
    importCarsData
  } = useInitializeHooks();

  // Create adapter functions to ensure type compatibility
  const handleViewCar = createViewCarAdapter(viewCar, cars);
  const handleUpdateCar = createUpdateCarAdapter(updateCar);
  const handleAddCar = createAddCarAdapter(addCar);
  const handleExportCarsData = createExportCarsDataAdapter(exportCarsData);
  const handleImportCarsData = createImportCarsDataAdapter(importCarsData, cars);
  
  // Create a proper wrapper for deleteCar that returns a Promise<boolean>
  const handleDeleteCar = async (carId: string): Promise<boolean> => {
    try {
      await deleteCar(carId);
      return true;
    } catch (error) {
      console.error("Error deleting car:", error);
      return false;
    }
  };
  
  // Modified to ensure it always returns a boolean value regardless of originalAddToCompare's return
  const handleAddToCompare = (carId: string): boolean => {
    try {
      if (typeof originalAddToCompare === 'function') {
        originalAddToCompare(carId);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding car to compare:", error);
      return false;
    }
  };
  
  // Modified to ensure it always returns a boolean value regardless of originalRemoveFromCompare's return
  const handleRemoveFromCompare = (carId: string): boolean => {
    try {
      if (typeof originalRemoveFromCompare === 'function') {
        originalRemoveFromCompare(carId);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing car from compare:", error);
      return false;
    }
  };
  
  // Create proper adapter for uploadCarImage
  const handleUploadCarImage = createUploadCarImageAdapter(uploadCarImage);

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
        isOnline,
        filter,
        setFilter,
        addToFavorites,
        removeFromFavorites,
        addToCompare: handleAddToCompare,
        removeFromCompare: handleRemoveFromCompare,
        clearCompare,
        getCarById,
        reloadCars,
        viewCar: handleViewCar,
        deleteCar: handleDeleteCar,
        updateCar: handleUpdateCar,
        addCar: handleAddCar,
        processOrder,
        getOrders,
        reloadOrders,
        exportCarsData: handleExportCarsData,
        importCarsData: handleImportCarsData,
        uploadCarImage: handleUploadCarImage,
        refreshFavorites
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
