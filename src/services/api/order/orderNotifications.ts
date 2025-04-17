
import { supabase } from '@/integrations/supabase/client';

/**
 * API functions for sending notifications about orders
 */
export const orderNotifications = {
  /**
   * Send a Telegram notification to admins about a new order
   */
  async notifyAdminsAboutNewOrder(order: any): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('[API] Sending Telegram notification about new order');
      
      // Get notification settings from localStorage
      const savedNotificationSettings = localStorage.getItem('notificationSettings');
      let telegramEnabled = true; // Default to true if no settings found
      
      if (savedNotificationSettings) {
        const settings = JSON.parse(savedNotificationSettings);
        telegramEnabled = settings.telegramNotificationsEnabled && settings.newOrdersEnabled;
      }
      
      if (!telegramEnabled) {
        console.log('Telegram notifications are disabled in settings');
        return { success: true, message: 'Telegram notifications are disabled' };
      }
      
      // Get car details if needed
      let carDetails = order.car;
      
      if (!carDetails && order.car_id) {
        const { data: carData } = await supabase
          .from('vehicles')
          .select('id, brand, model, price')
          .eq('id', order.car_id)
          .single();
          
        if (carData) {
          carDetails = carData;
        }
      }
      
      const { data, error } = await supabase.functions.invoke('telegram-notify', {
        body: { 
          order: {
            ...order,
            id: order.id.substring(0, 8),
            car: carDetails || { 
              brand: 'Неизвестно', 
              model: 'Неизвестно' 
            }
          }
        }
      });
      
      if (error) {
        console.error('Error sending Telegram notification:', error);
        return { success: false, message: error.message };
      }
      
      console.log('Telegram notification sent successfully:', data);
      return { success: true };
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
  
  /**
   * Send a notification about order status change
   */
  async notifyAboutOrderStatusChange(orderId: string, status: string): Promise<{ success: boolean; message?: string }> {
    try {
      console.log(`[API] Sending notification about order ${orderId} status change to: ${status}`);
      
      // Get notification settings from localStorage
      const savedNotificationSettings = localStorage.getItem('notificationSettings');
      let telegramEnabled = true; // Default to true if no settings found
      
      if (savedNotificationSettings) {
        const settings = JSON.parse(savedNotificationSettings);
        telegramEnabled = settings.telegramNotificationsEnabled && settings.newOrdersEnabled;
      }
      
      if (!telegramEnabled) {
        console.log('Telegram notifications are disabled in settings');
        return { success: true, message: 'Telegram notifications are disabled' };
      }
      
      // Get the order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          vehicles:car_id (
            id,
            brand,
            model,
            price
          )
        `)
        .eq('id', orderId)
        .single();
      
      if (orderError || !order) {
        console.error('Error fetching order details:', orderError);
        return { success: false, message: orderError?.message || 'Order not found' };
      }
      
      // Format status in Russian
      const statusText = {
        'new': 'Новый',
        'processing': 'В обработке',
        'completed': 'Завершен',
        'cancelled': 'Отменен'
      }[status] || status;
      
      // Create message
      const car = order.vehicles ? `${order.vehicles.brand} ${order.vehicles.model}` : 'Неизвестный автомобиль';
      const message = `
🔄 *СТАТУС ЗАКАЗА ИЗМЕНЕН*

Заказ #${orderId.substring(0, 8)} изменил статус на "${statusText}"

👤 *Клиент:* ${order.customer_name}
📱 *Телефон:* ${order.customer_phone}
🚗 *Автомобиль:* ${car}

⏰ *Обновлено:* ${new Date().toLocaleString('ru-RU')}
      `;
      
      // Send the notification (in a real app, we'd also send to the customer)
      const { data, error } = await supabase.functions.invoke('telegram-notify', {
        body: { 
          adminMessage: message,
          type: 'status_change'
        }
      });
      
      if (error) {
        console.error('Error sending Telegram notification:', error);
        return { success: false, message: error.message };
      }
      
      console.log('Status change notification sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Error sending status change notification:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};
