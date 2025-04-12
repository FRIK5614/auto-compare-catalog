
import { Order } from "@/types/car";

export type OrdersState = {
  orders: Order[];
  loading: boolean;
  isOnline: boolean;
  setOrders: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
};

export type OrdersActions = {
  processOrder: (orderId: string, status: Order['status']) => Promise<boolean>;
  getOrders: () => Order[];
  reloadOrders: () => Promise<void>;
};

export type UseOrdersReturn = OrdersState & OrdersActions;
