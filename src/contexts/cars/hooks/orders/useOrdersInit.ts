
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/car";
import { OrdersState } from "./types";
import { useOrdersSync } from "./useOrdersSync";
import { loadOrdersFromLocalStorage, saveOrdersToLocalStorage } from "../../utils";
import { useToast } from "@/hooks/use-toast";
import { transformOrder } from "@/services/api/transformers";

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
      
      console.log("Загрузка заказов напрямую из Supabase...");
      
      // Direct query to Supabase with enhanced logging
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
      console.log("Number of orders returned:", ordersData ? ordersData.length : 0);
      
      if (!ordersData || ordersData.length === 0) {
        console.log("No orders found in database");
        setOrders([]);
        saveOrdersToLocalStorage([]);
        return;
      }
      
      // Transform data to match Order type with robust error handling
      const transformedOrders: Order[] = [];
      
      for (const order of ordersData) {
        try {
          const transformedOrder = transformOrder(order);
          transformedOrders.push(transformedOrder);
        } catch (transformError) {
          console.error(`Error transforming order ${order.id}:`, transformError);
          // Add a safe fallback transformation
          transformedOrders.push({
            id: order.id,
            carId: order.car_id,
            customerName: order.customer_name || 'Unknown',
            customerPhone: order.customer_phone || 'Unknown',
            customerEmail: order.customer_email || 'Unknown',
            message: order.message || '',
            status: (order.status || 'new') as Order['status'],
            createdAt: order.created_at,
            updatedAt: order.updated_at || order.created_at,
            car: order.vehicles ? {
              id: order.vehicles.id,
              brand: order.vehicles.brand || 'Unknown',
              model: order.vehicles.model || 'Unknown',
              image_url: order.vehicles.image_url
            } : undefined
          });
        }
      }
      
      console.log(`Loaded ${transformedOrders.length} orders from database:`, transformedOrders);
      setOrders(transformedOrders);
      saveOrdersToLocalStorage(transformedOrders);
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
