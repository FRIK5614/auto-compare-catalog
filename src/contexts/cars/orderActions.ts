
import { Order } from "@/types/car";
import { updateOrderStatus } from "@/services/api/orderAPI";
import { saveOrdersToLocalStorage } from "./utils";
import { supabase } from "@/integrations/supabase/client";

// Process order - update status
export const processOrder = async (
  orderId: string, 
  status: Order['status'],
  orders: Order[],
  onSuccess: (updatedOrders: Order[]) => void,
  onError: (message: string) => void
) => {
  try {
    console.log('Processing order:', orderId, 'New status:', status);
    const success = await updateOrderStatus(orderId, status);
    
    if (!success) {
      throw new Error("Failed to update order status");
    }
    
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    
    saveOrdersToLocalStorage(updatedOrders);
    onSuccess(updatedOrders);
    
    // If this is a status change to 'processing' or if we're receiving a new order, notify admins via Telegram
    const shouldNotify = status === 'processing' || status === 'new';
    
    if (shouldNotify) {
      try {
        // Get the order that was just processed
        const orderToNotify = updatedOrders.find(o => o.id === orderId);
        console.log('Sending Telegram notification for order:', orderToNotify);
        
        if (orderToNotify) {
          // Get admin chat IDs from environment or use defaults
          const adminChatIds = ["123456789", "987654321"]; // Replace with actual admin chat IDs
          
          // Call the Supabase function to send notification
          const { data, error } = await supabase.functions.invoke('telegram-notify', {
            body: { 
              order: orderToNotify,
              adminChatIds: adminChatIds
            }
          });
          
          console.log('Telegram notification response:', data);
          
          if (error) {
            console.error('Error sending Telegram notification:', error);
          }
        } else {
          console.error('Could not find order for Telegram notification:', orderId);
        }
      } catch (notifyError) {
        console.error('Failed to send Telegram notification:', notifyError);
        // Don't throw, as we don't want to disrupt the main flow if notification fails
      }
    }
    
    return {
      title: "Заказ обновлен",
      description: `Статус заказа изменен на: ${status}`
    };
  } catch (err) {
    console.error("Failed to process order:", err);
    
    // Even if the API call fails, we'll update orders locally
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    
    saveOrdersToLocalStorage(updatedOrders);
    onSuccess(updatedOrders);
    
    return {
      title: "Заказ обновлен",
      description: `Статус заказа изменен на: ${status} (локально)`
    };
  }
};
