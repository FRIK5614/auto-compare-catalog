
import { useState, useEffect } from "react";
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

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load cars
        const carsData = await loadCars();
        setCars(carsData);
        
        // Load orders
        const ordersData = await loadOrders();
        setOrders(ordersData);
        
        // Load favorites
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

  // Function to reload cars
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
