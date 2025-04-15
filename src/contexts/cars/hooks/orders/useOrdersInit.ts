
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/car";
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
    if (loadingRef.current) return;
    
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
  }, []);

  // Function to load orders directly from the database
  const loadOrdersFromDatabase = async () => {
    try {
      console.log("Загрузка заказов напрямую из Supabase...");
      
      // Direct query to Supabase
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          vehicles:car_id (
            id,
            brand,
            model,
            image_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading orders from Supabase:', error);
        throw error;
      }
      
      console.log("Raw orders data from Supabase:", ordersData);
      
      // Transform data to match Order type
      const transformedOrders: Order[] = ordersData ? ordersData.map(order => ({
        id: order.id,
        carId: order.car_id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        message: order.message || '',
        status: (order.status || 'new') as Order['status'],
        createdAt: order.created_at,
        updatedAt: order.updated_at || order.created_at,
        car: order.vehicles ? {
          id: order.vehicles.id,
          brand: order.vehicles.brand,
          model: order.vehicles.model,
          image_url: order.vehicles.image_url
        } : undefined
      })) : [];
      
      console.log(`Loaded ${transformedOrders.length} orders from Supabase:`, transformedOrders);
      setOrders(transformedOrders);
      saveOrdersToLocalStorage(transformedOrders);
    } catch (error) {
      console.error('Error in loadOrdersFromDatabase:', error);
      throw error;
    }
  };

  return { loadOrdersFromDatabase };
};
