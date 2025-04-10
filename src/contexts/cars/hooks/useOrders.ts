
import { useState, useEffect } from "react";
import { Order } from "@/types/car";
import { useToast } from "@/hooks/use-toast";
import { processOrder as processOrderAction } from "../orderActions";
import { loadOrders } from "../dataLoaders";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  // Загружаем заказы при инициализации
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await loadOrders();
        console.log("Loaded orders from API:", ordersData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to load orders:", error);
        toast({
          variant: "destructive",
          title: "Ошибка загрузки заказов",
          description: "Не удалось загрузить данные о заказах"
        });
      }
    };
    
    fetchOrders();
  }, [toast]);

  // Process an order (update status)
  const handleProcessOrder = async (orderId: string, status: Order['status']) => {
    const result = await processOrderAction(
      orderId, 
      status, 
      orders, 
      (updatedOrders) => setOrders(updatedOrders),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
  };

  // Get all orders
  const getOrders = () => {
    return orders;
  };

  return {
    orders,
    setOrders,
    processOrder: handleProcessOrder,
    getOrders
  };
};
