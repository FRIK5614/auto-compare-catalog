
import { Order } from "@/types/car";
import { updateOrderStatus } from "@/services/api";
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
    const success = await updateOrderStatus(orderId, status);
    
    if (!success) {
      throw new Error("Failed to update order status");
    }
    
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    
    saveOrdersToLocalStorage(updatedOrders);
    onSuccess(updatedOrders);
    
    // If this is a new order, notify admins via Telegram
    if (status === 'new') {
      try {
        // Get the order that was just processed
        const orderToNotify = updatedOrders.find(o => o.id === orderId);
        if (orderToNotify) {
          // Get the car details for the order
          const { data, error } = await supabase.functions.invoke('telegram-notify', {
            body: { 
              order: orderToNotify,
              // In a real implementation, these would come from admin settings
              adminChatIds: ["ADMIN_CHAT_ID_1", "ADMIN_CHAT_ID_2"] 
            }
          });
          
          console.log('Telegram notification sent:', data);
          
          if (error) {
            console.error('Error sending Telegram notification:', error);
          }
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
