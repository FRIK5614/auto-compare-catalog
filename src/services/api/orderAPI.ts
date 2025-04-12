
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/car';
import { v4 as uuidv4 } from 'uuid';
import { transformOrder } from './transformers';

export const orderAPI = {
  /**
   * Retrieve all orders from the database
   */
  async getAllOrders(): Promise<Order[]> {
    try {
      console.log('[API] Getting all orders');
      
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
        console.log('No orders found');
        return [];
      }
      
      console.log(`Retrieved ${orders.length} orders`);
      
      // Transform data to match Order type
      const transformedOrders: Order[] = orders.map(order => {
        return {
          id: order.id,
          carId: order.car_id,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          customerEmail: order.customer_email,
          // Check if message exists before using it
          message: order.message || '',
          status: order.status || 'new',
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
      console.error('Error in getAllOrders:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      console.log(`[API] Getting order with ID: ${orderId}`);
      
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
        .eq('id', orderId)
        .single();
      
      if (error) {
        console.error('Error fetching order:', error);
        return null;
      }
      
      if (!data) {
        console.log('Order not found');
        return null;
      }
      
      return transformOrder(data);
    } catch (error) {
      console.error('Error in getOrderById:', error);
      return null;
    }
  },
  
  /**
   * Submit a new purchase request
   */
  async submitPurchaseRequest(
    carId: string,
    customerName: string,
    customerPhone: string,
    customerEmail: string,
    message?: string
  ): Promise<{ success: boolean; message: string; orderId?: string }> {
    try {
      console.log(`[API] Submitting purchase request for car: ${carId}`);
      
      const newOrder = {
        id: uuidv4(),
        car_id: carId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        status: 'new',
        message: message || ''
      };
      
      console.log('Submitting order with data:', newOrder);
      
      const { data, error } = await supabase
        .from('orders')
        .insert(newOrder)
        .select();
      
      if (error) {
        console.error('Error submitting order:', error);
        return {
          success: false,
          message: `Ошибка при отправке заявки: ${error.message}`
        };
      }
      
      console.log('Order submitted successfully:', data);
      
      return {
        success: true,
        message: 'Заявка успешно отправлена',
        orderId: data[0]?.id
      };
    } catch (error) {
      console.error('Error in submitPurchaseRequest:', error);
      return {
        success: false,
        message: 'Произошла ошибка при отправке заявки'
      };
    }
  },
  
  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: 'new' | 'processing' | 'completed' | 'canceled'
  ): Promise<boolean> {
    try {
      console.log(`[API] Updating order ${orderId} status to ${status}`);
      
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) {
        console.error('Error updating order status:', error);
        return false;
      }
      
      console.log('Order status updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      return false;
    }
  }
};
