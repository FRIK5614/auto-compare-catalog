
import { useCallback } from "react";
import { Order } from "@/types/car";
import { loadOrders } from "../../dataLoaders";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OrdersState, OrdersActions } from "./types";
import { useOrdersSync } from "./useOrdersSync";
import { loadOrdersFromLocalStorage, saveOrdersToLocalStorage } from "./useLocalStorage";
import { orderAPI } from "@/services/api/orderAPI";

export const useOrdersActions = (state: OrdersState): OrdersActions => {
  const { orders, setOrders, loading, setLoading, isOnline } = state;
  const { toast } = useToast();
  const { syncPendingOrders, addToPendingOrders } = useOrdersSync(orders, setOrders, isOnline);

  // Reload orders from database
  const reloadOrdersFromDB = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      console.log("Обновление заказов из API...");
      // Use orderAPI directly to ensure we get data from the database
      const ordersData = await orderAPI.getAllOrders();
      console.log("Заказы обновлены:", ordersData);
      
      setOrders(ordersData);
      saveOrdersToLocalStorage(ordersData);
      
      toast({
        title: "Заказы обновлены",
        description: `Загружено ${ordersData.length} заказов`
      });
      
    } catch (error) {
      console.error("Не удалось обновить заказы:", error);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки заказов",
        description: "Не удалось обновить данные о заказах"
      });
    } finally {
      setLoading(false);
    }
  }, [loading, setLoading, setOrders, toast]);

  // Process order (update status)
  const handleProcessOrder = useCallback(async (orderId: string, status: Order['status']) => {
    try {
      // Always update local state
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      setOrders(updatedOrders);
      saveOrdersToLocalStorage(updatedOrders);
      
      if (isOnline) {
        // If online, update in database using our dedicated API
        const success = await orderAPI.updateOrderStatus(orderId, status);
        
        if (!success) {
          throw new Error("Failed to update order status in database");
        }
      } else {
        // If offline, add to pending orders
        const orderToUpdate = orders.find(order => order.id === orderId);
        if (orderToUpdate) {
          addToPendingOrders({
            ...orderToUpdate,
            status
          });
        }
      }
      
      toast({
        title: "Статус заказа обновлен",
        description: `Заказ #${orderId.substring(0, 8)} теперь имеет статус "${status}"`
      });
      
      return true;
    } catch (error) {
      console.error("Ошибка при обработке заказа:", error);
      toast({ 
        variant: "destructive", 
        title: "Ошибка", 
        description: "Не удалось обновить статус заказа" 
      });
      return false;
    }
  }, [orders, isOnline, setOrders, addToPendingOrders, toast]);

  // Get all orders
  const getOrders = useCallback(() => {
    return orders;
  }, [orders]);

  return {
    processOrder: handleProcessOrder,
    getOrders,
    reloadOrders: reloadOrdersFromDB
  };
};
