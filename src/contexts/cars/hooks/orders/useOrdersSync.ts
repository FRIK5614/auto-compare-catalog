
import { useCallback, useRef } from "react";
import { Order } from "@/types/car";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useOrdersSync = (
  orders: Order[],
  setOrders: (orders: Order[]) => void,
  isOnline: boolean
) => {
  const pendingOrdersRef = useRef<{[key: string]: Order}>({});
  const { toast } = useToast();

  // Sync pending orders with database
  const syncPendingOrders = useCallback(async () => {
    const pendingOrders = pendingOrdersRef.current;
    const pendingOrderIds = Object.keys(pendingOrders);
    
    if (pendingOrderIds.length === 0) return;
    
    console.log(`Синхронизация ${pendingOrderIds.length} отложенных заказов...`);
    
    for (const orderId of pendingOrderIds) {
      const order = pendingOrders[orderId];
      
      try {
        // Check if order exists in database
        const { data: existingOrder, error: checkError } = await supabase
          .from('orders')
          .select('id')
          .eq('id', orderId)
          .single();
        
        if (checkError) {
          // Order doesn't exist, create it
          const { error: insertError } = await supabase
            .from('orders')
            .insert({
              id: order.id,
              car_id: order.carId,
              customer_name: order.customerName,
              customer_phone: order.customerPhone,
              customer_email: order.customerEmail,
              status: order.status,
              message: order.message,
              created_at: order.createdAt || new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (insertError) {
            console.error(`Ошибка создания заказа ${orderId}:`, insertError);
            continue;
          }
          
          console.log(`Заказ ${orderId} успешно создан в базе`);
        } else {
          // Order exists, update its status
          const { error: updateError } = await supabase
            .from('orders')
            .update({ 
              status: order.status,
              updated_at: new Date().toISOString()
            })
            .eq('id', orderId);
          
          if (updateError) {
            console.error(`Ошибка обновления заказа ${orderId}:`, updateError);
            continue;
          }
          
          console.log(`Заказ ${orderId} успешно обновлен в базе`);
        }
        
        // Remove from pending after successful sync
        delete pendingOrdersRef.current[orderId];
      } catch (error) {
        console.error(`Ошибка синхронизации заказа ${orderId}:`, error);
      }
    }
    
    const remainingOrders = Object.keys(pendingOrdersRef.current).length;
    if (remainingOrders > 0) {
      console.warn(`${remainingOrders} заказов не удалось синхронизировать`);
    } else {
      console.log("Все отложенные заказы успешно синхронизированы");
    }
  }, []);

  // Add order to pending sync
  const addToPendingOrders = useCallback((order: Order) => {
    pendingOrdersRef.current[order.id] = order;
    console.log(`Заказ ${order.id} добавлен в список отложенных`);
    
    toast({
      title: "Заказ обновлен локально",
      description: "Изменения будут синхронизированы при подключении к интернету"
    });
  }, [toast]);

  return {
    syncPendingOrders,
    addToPendingOrders,
    pendingOrdersRef
  };
};
