
import { Order } from "@/types/car";
import { updateOrderStatus } from "@/services/api/orderAPI";
import { supabase } from "@/integrations/supabase/client";

// Process an order (update status)
export const processOrder = async (
  orderId: string,
  status: Order['status'],
  orders: Order[],
  onSuccess: (updatedOrders: Order[]) => void,
  onError: (message: string) => void
) => {
  try {
    console.log(`Processing order ${orderId}, setting status to ${status}`);

    // Call the API to update order status
    const success = await updateOrderStatus(orderId, status);

    if (!success) {
      throw new Error("Failed to update order status in database");
    }

    // Update local state
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status } 
        : order
    );

    onSuccess(updatedOrders);

    return {
      title: "Статус заказа обновлен",
      description: `Заказ успешно обновлен с новым статусом "${status}"`
    };
  } catch (err) {
    console.error("Failed to process order:", err);
    
    onError(err instanceof Error ? err.message : "Ошибка при обработке заказа");
    
    return {
      title: "Ошибка",
      description: "Не удалось обновить статус заказа"
    };
  }
};

// Load all orders from Supabase directly
export const loadOrders = async (): Promise<Order[]> => {
  try {
    console.log('[API] Getting all orders directly from Supabase');
    
    // Query the orders table with a join to vehicles to get car details
    const { data: orders, error } = await supabase
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
      console.error('Error fetching orders:', error);
      throw new Error(error.message);
    }
    
    if (!orders || orders.length === 0) {
      console.log('No orders found in database');
      return [];
    }
    
    console.log(`Retrieved ${orders.length} orders from Supabase`);
    
    // Transform data to match Order type
    const transformedOrders: Order[] = orders.map(order => {
      // First, check if Supabase table needs updating
      console.log('Order data from Supabase:', order);
      
      return {
        id: order.id,
        carId: order.car_id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        // Fix: Handle missing message field with proper null coalescing
        message: (order as any).message || '',
        status: (order.status || 'new') as Order['status'],
        createdAt: order.created_at,
        car: order.vehicles ? {
          id: order.vehicles.id,
          brand: order.vehicles.brand,
          model: order.vehicles.model,
          image_url: order.vehicles.image_url
        } : undefined
      };
    });
    
    return transformedOrders;
  } catch (error) {
    console.error('Error in loadOrders:', error);
    return [];
  }
};
