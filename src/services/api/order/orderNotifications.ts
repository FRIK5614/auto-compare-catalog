
import { supabase } from '@/integrations/supabase/client';

/**
 * API functions for sending notifications about orders
 */
export const orderNotifications = {
  /**
   * Send a Telegram notification to admins about a new order
   */
  async notifyAdminsAboutNewOrder(order: any): Promise<void> {
    try {
      console.log('[API] Sending Telegram notification about new order');
      
      await supabase.functions.invoke('telegram-notify', {
        body: { 
          order: {
            ...order,
            id: order.id.substring(0, 8),
            car: { 
              brand: 'Определяется...', 
              model: 'Определяется...' 
            }
          } 
        }
      });
      
      console.log('Telegram notification sent successfully');
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      // Don't throw to avoid breaking the order submission flow
    }
  }
};
