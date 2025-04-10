
import { Order } from "@/types/car";
import { updateOrderStatus } from "@/services/api";
import { saveOrdersToLocalStorage } from "./utils";

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
