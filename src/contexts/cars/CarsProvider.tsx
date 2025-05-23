
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
    addToCompare,
    removeFromCompare,
    clearCompare: originalClearCompare,
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

  // Fix the clearCompare function to ensure it has the correct signature
  const handleClearCompare = () => {
    if (typeof originalClearCompare === 'function') {
      originalClearCompare();
    }
  };

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
  
  // Fix the addToCompare function to ensure it returns a Promise<boolean> value
  const handleAddToCompare = async (carId: string): Promise<boolean> => {
    try {
      if (typeof addToCompare === 'function') {
        // Execute the addToCompare function
        const result = addToCompare(carId);
        console.log("Add to compare result:", result, "for car ID:", carId, "Current compareCars:", compareCars);
        // Always return true since we don't have a way to determine success/failure
        return true;
      }
      console.warn("addToCompare function is not available");
      return false;
    } catch (error) {
      console.error("Error adding car to compare:", error);
      return false;
    }
  };
  
  // Fix the removeFromCompare function to ensure it returns a Promise<boolean> value
  const handleRemoveFromCompare = async (carId: string): Promise<boolean> => {
    try {
      if (typeof removeFromCompare === 'function') {
        // Execute the removeFromCompare function
        removeFromCompare(carId);
        // Always return true since we don't have a way to determine success/failure
        return true;
      }
      console.warn("removeFromCompare function is not available");
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
        clearCompare: handleClearCompare,
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
