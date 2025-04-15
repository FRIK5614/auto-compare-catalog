
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/car';
import { v4 as uuidv4 } from 'uuid';
import { transformOrder } from './transformers';

// Create a singleton export for all order-related API functions
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
      
      console.log('Raw orders data:', orders);
      
      // Transform data to match Order type
      const transformedOrders: Order[] = orders?.map(order => transformOrder(order)) || [];
      console.log(`Retrieved ${transformedOrders.length} orders:`, transformedOrders);
      
      return transformedOrders;
    } catch (error) {
      console.error('Error in getAllOrders:', error);
      // Return empty array instead of throwing to avoid breaking the UI
      return [];
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
      
      // Add debugging to check params
      console.log('Order request data:', {
        carId,
        customerName,
        customerPhone,
        customerEmail,
        message
      });
      
      const newOrder = {
        id: uuidv4(),
        car_id: carId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        status: 'new',
        message: message || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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

      // Try to send a Telegram notification to admins
      try {
        await supabase.functions.invoke('telegram-notify', {
          body: { 
            order: {
              ...newOrder,
              id: newOrder.id.substring(0, 8),
              car: { 
                brand: 'Определяется...', 
                model: 'Определяется...' 
              }
            } 
          }
        });
      } catch (notifyError) {
        console.error('Failed to send Telegram notification:', notifyError);
        // Don't fail the order if notification fails
      }
      
      return {
        success: true,
        message: 'Заявка успешно отправлена',
        orderId: data && data.length > 0 ? data[0]?.id : newOrder.id
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
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
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

// Export individual functions for compatibility
export const fetchOrders = async (): Promise<Order[]> => {
  return orderAPI.getAllOrders();
};

export const updateOrderStatus = async (
  orderId: string,
  status: 'new' | 'processing' | 'completed' | 'canceled'
): Promise<boolean> => {
  return orderAPI.updateOrderStatus(orderId, status);
};

export const submitPurchaseRequest = async (
  carId: string,
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  message?: string
): Promise<{ success: boolean; message: string; orderId?: string }> => {
  return orderAPI.submitPurchaseRequest(carId, customerName, customerPhone, customerEmail, message);
};
