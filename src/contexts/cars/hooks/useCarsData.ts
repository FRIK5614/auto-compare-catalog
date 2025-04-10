
import { useState, useEffect, useRef } from "react";
import { Car, Order } from "@/types/car";
import { useToast } from "@/hooks/use-toast";
import { loadCars, loadFavorites, loadOrders } from "../dataLoaders";

export const useCarsData = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const dataInitialized = useRef(false);

  // Инициализируем данные
  useEffect(() => {
    if (dataInitialized.current) return;
    dataInitialized.current = true;
    
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Загружаем автомобили
        const carsData = await loadCars();
        setCars(carsData);
        
        // Загружаем заказы
        const ordersData = await loadOrders();
        setOrders(ordersData);
        
        // Загружаем избранное
        const favoritesData = await loadFavorites();
        setFavorites(favoritesData);
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to initialize data:", err);
        const errorMessage = err instanceof Error ? err.message : "Не удалось загрузить данные";
        setError(errorMessage);
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Ошибка загрузки",
          description: errorMessage
        });
      }
    };

    initializeData();
  }, [toast]);

  // Функция для перезагрузки автомобилей
  const reloadCars = async () => {
    try {
      setLoading(true);
      const data = await loadCars();
      setCars(data);
      toast({
        title: "Данные обновлены",
        description: "Каталог автомобилей успешно обновлен"
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to reload cars:", err);
      const errorMessage = err instanceof Error ? err.message : "Не удалось перезагрузить данные";
      setError(errorMessage);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Ошибка обновления",
        description: errorMessage
      });
    }
  };

  return {
    cars,
    setCars,
    orders,
    setOrders,
    favorites,
    setFavorites,
    loading,
    error,
    reloadCars
  };
};
