
import { useCallback } from "react";
import { Order } from "@/types/car";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OrdersState, OrdersActions } from "./types";
import { useOrdersSync } from "./useOrdersSync";
import { orderAPI } from "@/services/api/orderAPI";

export const useOrdersActions = (state: OrdersState): OrdersActions => {
  const { orders, setOrders, loading, setLoading, isOnline } = state;
  const { toast } = useToast();
  const { syncPendingOrders, addToPendingOrders } = useOrdersSync(orders, setOrders, isOnline);

  // Reload orders from database
  const reloadOrdersFromDB = useCallback(async (): Promise<void> => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      console.log("Обновление заказов из базы данных...");
      // Use direct Supabase query to ensure we get fresh data from the database
      const { data: ordersData, error } = await supabase
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
        throw error;
      }
      
      // Transform data to match Order type
      const transformedOrders: Order[] = ordersData ? ordersData.map(order => ({
        id: order.id,
        carId: order.car_id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        message: (order as any).message || '',
        status: (order.status || 'new') as Order['status'],
        createdAt: order.created_at,
        updatedAt: order.updated_at || order.created_at,
        car: order.vehicles ? {
          id: order.vehicles.id,
          brand: order.vehicles.brand,
          model: order.vehicles.model,
          image_url: order.vehicles.image_url
        } : undefined
      })) : [];
      
      console.log("Заказы обновлены:", transformedOrders);
      
      setOrders(transformedOrders);
      
      toast({
        title: "Заказы обновлены",
        description: `Загружено ${transformedOrders.length} заказов`
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
      // Always update database first
      if (isOnline) {
        // Update in database directly using Supabase
        const { error } = await supabase
          .from('orders')
          .update({ 
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);
        
        if (error) {
          throw new Error(`Failed to update order status in database: ${error.message}`);
        }
        
        // Then update local state
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, status } : order
        );
        setOrders(updatedOrders);
      } else {
        // If offline, add to pending orders and update local state
        const orderToUpdate = orders.find(order => order.id === orderId);
        if (orderToUpdate) {
          addToPendingOrders({
            ...orderToUpdate,
            status
          });
          
          // Update local state
          const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, status } : order
          );
          setOrders(updatedOrders);
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
  const getOrders = useCallback((): Order[] => {
    return orders;
  }, [orders]);

  return {
    processOrder: handleProcessOrder,
    getOrders,
    reloadOrders: reloadOrdersFromDB
  };
};
