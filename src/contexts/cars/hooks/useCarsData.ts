
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
  const reloadInProgress = useRef(false);

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
        
        // Уведомляем пользователя о количестве загруженных автомобилей
        if (carsData.length > 0) {
          toast({
            title: "Данные загружены",
            description: `Успешно загружено ${carsData.length} автомобилей из базы данных`
          });
        } else {
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

  // Функция для перезагрузки автомобилей
  const reloadCars = async () => {
    // Предотвращаем параллельные вызовы reloadCars
    if (reloadInProgress.current) {
      toast({
        title: "Загрузка данных",
        description: "Обновление данных уже выполняется, пожалуйста подождите"
      });
      return;
    }
    
    reloadInProgress.current = true;
    
    try {
      setLoading(true);
      setError(null);
      toast({
        title: "Загрузка данных",
        description: "Обновление данных из базы данных..."
      });
      
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
      reloadInProgress.current = false;
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
