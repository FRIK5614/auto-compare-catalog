
import { useCallback } from "react";
import { Order } from "@/types/car";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OrdersState, OrdersActions } from "./types";
import { useOrdersSync } from "./useOrdersSync";
import { transformOrder } from "@/services/api/transformers";
import { saveOrdersToLocalStorage } from "../../utils";

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
      
      // Direct Supabase query with better logging
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          vehicles:car_id (
            id,
            brand,
            model,
            image_url,
            images
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
      
      console.log("Raw orders data from Supabase:", ordersData);
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
      
      // Transform data to match Order type with better validation
      const transformedOrders: Order[] = ordersData.map(order => {
        try {
          return transformOrder(order);
        } catch (transformError) {
          console.error(`Error transforming order ${order.id}:`, transformError);
          // Provide a fallback transformation to not lose the order
          return {
            id: order.id,
            carId: order.car_id,
            customerName: order.customer_name || 'Unknown',
            customerPhone: order.customer_phone || 'Unknown',
            customerEmail: order.customer_email || 'Unknown',
            message: order.message || '',
            status: (order.status || 'new') as Order['status'],
            createdAt: order.created_at,
            updatedAt: order.updated_at || order.created_at,
            car: order.vehicles ? {
              id: order.vehicles.id,
              brand: order.vehicles.brand || 'Unknown',
              model: order.vehicles.model || 'Unknown',
              image_url: order.vehicles.image_url,
              images: order.vehicles.images
            } : undefined
          };
        }
      });
      
      console.log("Transformed orders:", transformedOrders);
      
      setOrders(transformedOrders);
      saveOrdersToLocalStorage(transformedOrders);
      
      toast({
        title: "Заказы обновлены",
        description: `Загружено ${transformedOrders.length} заказов из базы данных`
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
      
      // Update in database directly using Supabase
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) {
        console.error("Error updating order in Supabase:", error);
        throw new Error(`Failed to update order status in database: ${error.message}`);
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
