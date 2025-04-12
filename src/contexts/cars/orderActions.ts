
import { Order } from "@/types/car";
import { updateOrderStatus } from "@/services/api/orderAPI";

// Process an order (update status)
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
    
    onSuccess(updatedOrders);
    
    return {
      title: "Статус заказа обновлен",
      description: `Заказ успешно переведен в статус "${status}"`
    };
  } catch (err) {
    console.error("Failed to process order:", err);
    onError(err instanceof Error ? err.message : "Не удалось обновить статус заказа");
    
    return {
      variant: "destructive" as const,
      title: "Ошибка обновления",
      description: "Не удалось обновить статус заказа"
    };
  }
};
