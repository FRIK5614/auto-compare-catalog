
import { useEffect, useRef } from "react";
import { loadOrders } from "../../dataLoaders";
import { OrdersState } from "./types";
import { useOrdersSync } from "./useOrdersSync";
import { loadOrdersFromLocalStorage, saveOrdersToLocalStorage } from "../../utils";
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
          // If offline, use database through useLocalStorage function
          try {
            const localOrders = await loadOrdersFromLocalStorage();
            console.log("Загружены заказы из базы данных:", localOrders);
            setOrders(localOrders);
          } catch (error) {
            console.error("Ошибка при загрузке заказов из базы данных:", error);
            setOrders([]);
          }
        }
      } catch (error) {
        console.error("Ошибка при инициализации заказов:", error);
        
        // On error, try to use direct database query
        try {
          const localOrders = await loadOrdersFromLocalStorage();
          if (localOrders.length > 0) {
            setOrders(localOrders);
          }
        } catch (fallbackError) {
          console.error("Ошибка при загрузке заказов из базы данных:", fallbackError);
          setOrders([]);
        }
        
        toast({
          variant: "destructive",
          title: "Ошибка загрузки заказов",
          description: "Не удалось загрузить заказы из базы данных"
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
