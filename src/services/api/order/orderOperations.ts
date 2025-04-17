
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * API functions for creating and updating orders
 */
export const orderOperations = {
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

      // Try to send a Telegram notification
      try {
        await orderNotifications.notifyAdminsAboutNewOrder(newOrder);
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
    status: 'new' | 'processing' | 'completed' | 'cancelled'
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

// Import here to avoid circular dependency
import { orderNotifications } from './orderNotifications';
