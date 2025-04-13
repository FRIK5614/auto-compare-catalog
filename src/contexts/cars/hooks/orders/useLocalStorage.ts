
import { useEffect } from "react";
import { Order } from "@/types/car";
import { supabase } from "@/integrations/supabase/client";

export const useLocalStorage = (
  orders: Order[],
  setOrders: (orders: Order[]) => void
) => {
  // Save orders to database when they change
  useEffect(() => {
    if (orders.length > 0) {
      saveOrdersToSupabase(orders);
    }
  }, [orders]);

  return {
    loadOrdersFromSupabase,
    saveOrdersToSupabase
  };
};

// Save orders to Supabase (replacing localStorage)
export const saveOrdersToSupabase = async (orders: Order[]): Promise<void> => {
  try {
    console.log('Saving orders to database instead of localStorage');
    // Note: We don't actually save orders back to Supabase here
    // Orders should be created/updated through the order API only
  } catch (error) {
    console.error('Error saving orders to database:', error);
  }
};

// Load orders from Supabase (replacing localStorage)
export const loadOrdersFromSupabase = async (): Promise<Order[]> => {
  try {
    console.log('Loading orders from database instead of localStorage');
    
    const { data, error } = await supabase
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
      return [];
    }
    
    // Transform data to match Order type
    const transformedOrders: Order[] = data ? data.map(order => ({
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
    
    return transformedOrders;
  } catch (error) {
    console.error('Error loading orders from database:', error);
    return [];
  }
};

// Export old function names for compatibility
export const loadOrdersFromLocalStorage = loadOrdersFromSupabase;
export const saveOrdersToLocalStorage = saveOrdersToSupabase;
