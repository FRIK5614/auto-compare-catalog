
import { useState, useEffect, useCallback, useRef } from "react";
import { Order } from "@/types/car";
import { useToast } from "@/hooks/use-toast";
import { processOrder as processOrderAction } from "../orderActions";
import { loadOrders } from "../dataLoaders";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const loadingRef = useRef(false);

  // Load orders on initialization
  useEffect(() => {
    const fetchOrders = async () => {
      if (loadingRef.current) return;
      
      loadingRef.current = true;
      setLoading(true);
      
      try {
        console.log("Loading orders from API in useOrders hook");
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
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };
    
    fetchOrders();
  }, [toast]);

  // Process an order (update status)
  const handleProcessOrder = useCallback(async (orderId: string, status: Order['status']) => {
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
  }, [orders, toast]);

  // Reload orders manually
  const reloadOrders = useCallback(async () => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    
    try {
      console.log("Reloading orders from API...");
      const ordersData = await loadOrders();
      console.log("Reloaded orders:", ordersData);
      setOrders(ordersData);
      toast({
        title: "Заказы обновлены",
        description: `Загружено ${ordersData.length} заказов`
      });
    } catch (error) {
      console.error("Failed to reload orders:", error);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки заказов",
        description: "Не удалось обновить данные о заказах"
      });
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [toast]);

  // Get all orders
  const getOrders = useCallback(() => {
    return orders;
  }, [orders]);

  return {
    orders,
    loading,
    setOrders,
    processOrder: handleProcessOrder,
    getOrders,
    reloadOrders
  };
};
