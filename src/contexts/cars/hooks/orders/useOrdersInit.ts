
import { useEffect, useRef } from "react";
import { loadOrders } from "../../dataLoaders";
import { OrdersState } from "./types";
import { useOrdersSync } from "./useOrdersSync";
import { loadOrdersFromLocalStorage, saveOrdersToLocalStorage } from "./useLocalStorage";
import { useToast } from "@/hooks/use-toast";

export const useOrdersInit = (state: OrdersState) => {
  const { orders, setOrders, loading, setLoading, isOnline } = state;
  const loadingRef = useRef(false);
  const { toast } = useToast();
  const { syncPendingOrders } = useOrdersSync(orders, setOrders, isOnline);

  // Network status effects
  useEffect(() => {
    if (isOnline) {
      // When connection is restored, sync pending orders
      syncPendingOrders();
      // And reload orders from database
      if (!loading && !loadingRef.current) {
        loadOrdersFromAPI();
      }
    } else {
      // When offline, show notification
      toast({
        title: "Офлайн режим",
        description: "Работа с заказами будет ограничена. Данные синхронизируются при подключении к интернету",
      });
    }
  }, [isOnline]);

  // Initial load
  useEffect(() => {
    if (loadingRef.current) return;
    
    const initializeOrders = async () => {
      loadingRef.current = true;
      setLoading(true);
      
      try {
        if (isOnline) {
          await loadOrdersFromAPI();
        } else {
          // If offline, use localStorage
          const localOrders = loadOrdersFromLocalStorage();
          console.log("Загружены заказы из localStorage:", localOrders);
          setOrders(localOrders);
        }
      } catch (error) {
        console.error("Ошибка при инициализации заказов:", error);
        
        // On error, try to use localStorage
        const localOrders = loadOrdersFromLocalStorage();
        if (localOrders.length > 0) {
          setOrders(localOrders);
        }
        
        toast({
          variant: "destructive",
          title: "Ошибка загрузки заказов",
          description: "Используются локальные данные"
        });
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };
    
    initializeOrders();
  }, []);

  // Load orders from API
  const loadOrdersFromAPI = async () => {
    try {
      console.log("Загрузка заказов из API...");
      const ordersData = await loadOrders();
      console.log("Загружены заказы из API:", ordersData);
      
      if (!ordersData || ordersData.length === 0) {
        console.warn("API не вернул ни одного заказа");
      }
      
      setOrders(ordersData);
      saveOrdersToLocalStorage(ordersData);
    } catch (error) {
      console.error("Не удалось загрузить заказы из API:", error);
      throw error;
    }
  };
};
