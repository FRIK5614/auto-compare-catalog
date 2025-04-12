
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
  
  // Fix: Pass only the file parameter to the uploadCarImage adapter
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
        addToCompare,
        removeFromCompare,
        clearCompare,
        getCarById,
        reloadCars,
        viewCar: handleViewCar,
        deleteCar,
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
