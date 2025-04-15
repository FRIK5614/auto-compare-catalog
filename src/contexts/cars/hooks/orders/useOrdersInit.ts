
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/car";
import { OrdersState } from "./types";
import { useOrdersSync } from "./useOrdersSync";
import { loadOrdersFromLocalStorage, saveOrdersToLocalStorage } from "../../utils";
import { useToast } from "@/hooks/use-toast";
import { orderAPI } from "@/services/api/order";

export const useOrdersInit = (state: OrdersState) => {
  const { orders, setOrders, loading, setLoading, isOnline } = state;
  const loadingRef = useRef(false);
  const { toast } = useToast();
  const { syncPendingOrders } = useOrdersSync(orders, setOrders, isOnline);
  const initCompletedRef = useRef(false);

  // Network status effects
  useEffect(() => {
    if (isOnline) {
      // When connection is restored, sync pending orders
      syncPendingOrders();
      // And reload orders from database
      if (!loading && !loadingRef.current) {
        loadOrdersFromDatabase();
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
    if (loadingRef.current || initCompletedRef.current) return;
    
    const initializeOrders = async () => {
      loadingRef.current = true;
      setLoading(true);
      
      try {
        if (isOnline) {
          await loadOrdersFromDatabase();
        } else {
          // If offline, use localStorage
          try {
            const localOrders = await loadOrdersFromLocalStorage();
            console.log("Загружены заказы из локального хранилища:", localOrders);
            setOrders(localOrders);
          } catch (error) {
            console.error("Ошибка при загрузке заказов из локального хранилища:", error);
            setOrders([]);
          }
        }
        
        // Mark initialization as completed
        initCompletedRef.current = true;
      } catch (error) {
        console.error("Ошибка при инициализации заказов:", error);
        
        // On error, try to use localStorage
        try {
          const localOrders = await loadOrdersFromLocalStorage();
          if (localOrders.length > 0) {
            setOrders(localOrders);
          }
        } catch (fallbackError) {
          console.error("Ошибка при загрузке заказов из локального хранилища:", fallbackError);
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
    
    // Set up real-time subscription for orders
    const ordersSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        console.log('Orders table change detected:', payload);
        // Reload orders when there's a change
        if (!loadingRef.current) {
          loadOrdersFromDatabase();
        }
      })
      .subscribe();
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  // Function to load orders directly from the database
  const loadOrdersFromDatabase = async () => {
    try {
      setLoading(true);
      loadingRef.current = true;
      
      console.log("Загрузка заказов напрямую из API...");
      
      // Use the new orderAPI to load orders
      const ordersData = await orderAPI.getAllOrders();
      
      console.log("Number of orders returned:", ordersData ? ordersData.length : 0);
      
      if (!ordersData || ordersData.length === 0) {
        console.log("No orders found in database");
        setOrders([]);
        saveOrdersToLocalStorage([]);
        return;
      }
      
      console.log(`Loaded ${ordersData.length} orders from database:`, ordersData);
      setOrders(ordersData);
      saveOrdersToLocalStorage(ordersData);
    } catch (err) {
      console.error('Error in loadOrdersFromDatabase:', err);
      throw err;
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  return { loadOrdersFromDatabase };
};
