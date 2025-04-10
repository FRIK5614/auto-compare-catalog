
import { useState } from "react";
import { Order } from "@/types/car";
import { useToast } from "@/hooks/use-toast";
import { processOrder as processOrderAction } from "../orderActions";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

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
