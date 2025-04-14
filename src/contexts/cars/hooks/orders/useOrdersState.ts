
import { useState, useEffect } from "react";
import { Order } from "@/types/car";
import { OrdersState } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const useOrdersState = (): OrdersState => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial load of orders
    loadOrdersFromDatabase();
    
    // Subscribe to orders updates
    const ordersSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        console.log('Orders table change detected:', payload);
        // Reload orders when there's a change
        loadOrdersFromDatabase();
      })
      .subscribe();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  // Function to load orders directly from the database
  const loadOrdersFromDatabase = async () => {
    try {
      setLoading(true);
      
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
        console.error('Error loading orders from database:', error);
        return;
      }
      
      // Transform data to match Order type
      const transformedOrders: Order[] = ordersData ? ordersData.map(order => ({
        id: order.id,
        carId: order.car_id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        message: (order as any).message || '',
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
      
      console.log(`Loaded ${transformedOrders.length} orders from database:`, transformedOrders);
      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error in loadOrdersFromDatabase:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    isOnline,
    setOrders,
    setLoading
  };
};
