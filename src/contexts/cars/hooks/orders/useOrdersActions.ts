
import { useCallback } from "react";
import { Order } from "@/types/car";
import { useToast } from "@/hooks/use-toast";
import { OrdersState, OrdersActions } from "./types";
import { useOrdersSync } from "./useOrdersSync";
import { saveOrdersToLocalStorage } from "../../utils";
import { orderAPI } from "@/services/api/order";

export const useOrdersActions = (state: OrdersState): OrdersActions => {
  const { orders, setOrders, loading, setLoading, isOnline } = state;
  const { toast } = useToast();
  const { syncPendingOrders, addToPendingOrders } = useOrdersSync(orders, setOrders, isOnline);

  // Reload orders from database
  const reloadOrdersFromDB = useCallback(async (): Promise<void> => {
    if (loading) {
      console.log("Already loading orders, skipping reload");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Обновление заказов из базы данных...");
      
      // Use the orderAPI.getAllOrders function from the new structure
      const ordersData = await orderAPI.getAllOrders();
      
      console.log("Number of orders returned:", ordersData ? ordersData.length : 0);
      
      // Better handling of no orders case
      if (!ordersData || ordersData.length === 0) {
        console.log("No orders found in database");
        setOrders([]);
        saveOrdersToLocalStorage([]);
        toast({
          title: "Заказы обновлены",
          description: "В базе данных не найдено ни одного заказа"
        });
        return;
      }
      
      console.log("Transformed orders:", ordersData);
      
      setOrders(ordersData);
      saveOrdersToLocalStorage(ordersData);
      
      toast({
        title: "Заказы обновлены",
        description: `Загружено ${ordersData.length} заказов из базы данных`
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
      console.log("Processing order:", orderId, "New status:", status);
      
      // Use the orderAPI.updateOrderStatus function from the new structure
      const success = await orderAPI.updateOrderStatus(orderId, status);
      
      if (!success) {
        throw new Error(`Failed to update order status in database`);
      }
      
      console.log("Order status updated in database");
      
      // Then update local state
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      setOrders(updatedOrders);
      
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
  }, [orders, setOrders, toast]);

  // Get all orders
  const getOrders = useCallback((): Order[] => {
    console.log("Getting orders from state:", orders);
    return orders;
  }, [orders]);

  return {
    processOrder: handleProcessOrder,
    getOrders,
    reloadOrders: reloadOrdersFromDB
  };
};
