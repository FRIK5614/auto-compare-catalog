import { createContext, useContext, ReactNode, useRef, useEffect } from "react";
import { CarsContextType, FilterOptions } from "./types";
import { useCarsData } from "./hooks/useCarsData";
import { useFilters } from "./hooks/useFilters";
import { useFavorites } from "./hooks/useFavorites";
import { useCompare } from "./hooks/useCompare";
import { useCarsCRUD } from "./hooks/useCarsCRUD";
import { useOrders } from "./hooks/useOrders";
import { loadFavoritesFromLocalStorage, loadCompareFromLocalStorage } from "./utils";
import { Car, CarImage } from "@/types/car";

const CarsContext = createContext<CarsContextType | undefined>(undefined);

export const CarsProvider = ({ children }: { children: ReactNode }) => {
  // Ref для отслеживания инициализации
  const isInitialized = useRef(false);
  const networkStatusChecked = useRef(false);
  
  // Используем наши кастомные хуки
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

  // Проверка сетевого статуса и обработка событий онлайн/офлайн
  useEffect(() => {
    if (!networkStatusChecked.current) {
      networkStatusChecked.current = true;
      
      // Проверяем начальный статус сети
      const initialOnlineStatus = navigator.onLine;
      console.log(`Начальный статус сети: ${initialOnlineStatus ? 'онлайн' : 'офлайн'}`);
      
      // Синхронизируем данные при загрузке, если мы онлайн
      if (initialOnlineStatus) {
        // Use refreshFavorites directly without the conditional check
        refreshFavorites();
        
        // Always reload orders
        reloadOrders();
      }
    }
  }, [refreshFavorites, reloadOrders]);

  // Загружаем избранное и сравнение из localStorage если пусто
  useEffect(() => {
    if (!isInitialized.current) {
      // Синхронизируем избранное
      if (initialFavorites.length > 0 && favorites.length === 0) {
        setFavorites(initialFavorites);
      } else if (favorites.length === 0) {
        const localFavorites = loadFavoritesFromLocalStorage();
        if (localFavorites.length > 0) {
          setFavorites(localFavorites);
        }
      }
      
      // Синхронизируем сравнение
      if (compareCars.length === 0) {
        const localCompare = loadCompareFromLocalStorage();
        if (localCompare.length > 0) {
          setCompareCars(localCompare);
        }
      }
      
      // Синхронизируем заказы
      if (initialOrders.length > 0 && orders.length === 0) {
        setOrders(initialOrders);
      }
      
      isInitialized.current = true;
    }
  }, [initialFavorites, favorites, compareCars, initialOrders, orders, setFavorites, setCompareCars, setOrders]);

  // Оборачиваем reloadCarsData чтобы соответствовать ожидаемому типу в CarsContextType
  const reloadCars = async (): Promise<Car[]> => {
    return await reloadCarsData();
  };

  // Определяем общий статус сетевого подключения
  const isOnline = favoritesIsOnline && ordersIsOnline && compareIsOnline && dataIsOnline;

  // Adapter functions to ensure type compatibility
  const handleViewCar = async (id: string): Promise<Car | undefined> => {
    // Implement proper viewCar functionality that returns a Car promise
    const result = await viewCar(id);
    return result ? cars.find(car => car.id === id) : undefined;
  };

  const handleUpdateCar = async (car: Car): Promise<Car> => {
    const success = await updateCar(car);
    return success ? car : Promise.reject("Failed to update car");
  };

  const handleAddCar = async (car: Partial<Car>): Promise<Car> => {
    const newCar = car as Car; // Type assertion for compatibility
    const success = await addCar(newCar);
    return success ? newCar : Promise.reject("Failed to add car");
  };

  const handleExportCarsData = async (): Promise<string> => {
    return Promise.resolve(exportCarsData());
  };

  const handleImportCarsData = async (data: string): Promise<Car[]> => {
    const success = await importCarsData(data);
    return success ? cars : Promise.reject("Failed to import cars");
  };

  const handleUploadCarImage = async (file: File, carId: string): Promise<CarImage> => {
    try {
      // Fix: Pass only the file parameter to uploadCarImage as it now expects just one parameter
      const imageUrl = await uploadCarImage(file);
      return {
        id: `img-${Date.now()}`,
        url: imageUrl,
        alt: 'Uploaded image'
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      return Promise.reject("Failed to upload image");
    }
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
