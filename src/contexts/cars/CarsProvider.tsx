
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
        refreshFavorites();
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
    await reloadCarsData();
    return cars;
  };

  // Определяем общий статус сетевого подключения
  const isOnline = favoritesIsOnline && ordersIsOnline && compareIsOnline && dataIsOnline;

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
        viewCar,
        deleteCar,
        updateCar,
        addCar,
        processOrder,
        getOrders,
        reloadOrders,
        exportCarsData,
        importCarsData,
        uploadCarImage,
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
