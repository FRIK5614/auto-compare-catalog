
import { useState, useEffect, useCallback, useRef } from "react";
import { Car, Order } from "@/types/car";
import { loadCars, loadOrders, loadFavorites } from "../dataLoaders";
import { loadFavoritesFromLocalStorage, loadOrdersFromLocalStorage } from "../utils";

export const useCarsData = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const loadingRef = useRef(false);

  // Следим за статусом сети
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // При восстановлении соединения обновляем данные
      if (!loadingRef.current) {
        reloadCars();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      if (loadingRef.current) return;
      
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      
      try {
        // Параллельно загружаем автомобили и заказы
        const [carsData, ordersData, favoritesData] = await Promise.all([
          loadCars(),
          loadOrders(),
          loadFavorites()
        ]);
        
        setCars(carsData);
        setOrders(ordersData);
        setFavorites(favoritesData);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
        
        // Если произошла ошибка, попробуем загрузить из базы данных напрямую
        try {
          const localOrdersPromise = loadOrdersFromLocalStorage();
          const localFavoritesPromise = loadFavoritesFromLocalStorage();
          
          const localOrders = await localOrdersPromise;
          const localFavorites = await localFavoritesPromise;
          
          if (localOrders.length > 0) {
            setOrders(localOrders);
          }
          
          if (localFavorites.length > 0) {
            setFavorites(localFavorites);
          }
        } catch (fallbackErr) {
          console.error("Ошибка при загрузке локальных данных:", fallbackErr);
        }
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };
    
    loadData();
  }, []);

  // Функция для перезагрузки данных
  const reloadCars = useCallback(async () => {
    if (loadingRef.current || !isOnline) return;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const carsData = await loadCars();
      setCars(carsData);
      return carsData;
    } catch (err) {
      console.error("Ошибка при обновлении данных:", err);
      setError("Не удалось обновить данные. Пожалуйста, попробуйте позже.");
      return [];
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [isOnline]);

  return {
    cars,
    setCars,
    orders,
    setOrders,
    favorites,
    setFavorites,
    loading,
    error,
    isOnline,
    reloadCars
  };
};
