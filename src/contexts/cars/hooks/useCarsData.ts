
import { useState, useEffect, useRef } from "react";
import { Car, Order } from "@/types/car";
import { useToast } from "@/hooks/use-toast";
import { loadCars, loadFavorites, loadOrders } from "../dataLoaders";

export const useCarsData = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  const dataInitialized = useRef(false);
  const reloadInProgress = useRef(false);
  const lastReloadTime = useRef(0);
  const RELOAD_COOLDOWN = 2000; // 2 seconds cooldown between reloads

  // Инициализируем данные
  useEffect(() => {
    if (dataInitialized.current) return;
    dataInitialized.current = true;
    
    const initializeData = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log("🔄 Initializing cars data - FIRST LOAD");
        
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
        lastReloadTime.current = Date.now();
        
        // Silent notification for initial load
        if (carsData.length === 0) {
          toast({
            variant: "destructive",
            title: "База данных пуста",
            description: "В базе данных нет автомобилей. Добавьте автомобили через панель администратора."
          });
        }
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

  // Функция для перезагрузки автомобилей с защитой от спама
  const reloadCars = async (): Promise<void> => {
    // Проверка на cooldown период
    const now = Date.now();
    const timeSinceLastReload = now - lastReloadTime.current;
    
    if (timeSinceLastReload < RELOAD_COOLDOWN) {
      console.log(`⏱️ Reload requested too soon (${timeSinceLastReload}ms since last reload)`);
      return;
    }
    
    // Предотвращаем параллельные вызовы reloadCars
    if (reloadInProgress.current) {
      console.log("🔄 Reload already in progress, skipping");
      toast({
        title: "Обновление данных",
        description: "Обновление данных уже выполняется, пожалуйста подождите"
      });
      return;
    }
    
    reloadInProgress.current = true;
    lastReloadTime.current = now;
    
    try {
      setLoading(true);
      setError("");
      console.log("🔄 Starting cars data reload");
      
      const data = await loadCars();
      setCars(data);
      
      if (data.length === 0) {
        toast({
          variant: "destructive",
          title: "База данных пуста",
          description: "База данных пуста. Добавьте автомобили через панель администратора."
        });
      } else {
        toast({
          title: "Данные обновлены",
          description: `Загружено ${data.length} автомобилей из базы данных`
        });
      }
      
      setLoading(false);
      console.log("✅ Cars data reload complete");
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
    } finally {
      // Добавляем небольшую задержку перед сбросом флага, чтобы избежать проблем с быстрыми множественными нажатиями
      setTimeout(() => {
        reloadInProgress.current = false;
      }, 300);
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
