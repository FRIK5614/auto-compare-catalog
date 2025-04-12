
import { useEffect } from "react";
import { Order } from "@/types/car";

export const useLocalStorage = (
  orders: Order[],
  setOrders: (orders: Order[]) => void
) => {
  // Save orders to localStorage when they change
  useEffect(() => {
    if (orders.length > 0) {
      saveOrdersToLocalStorage(orders);
    }
  }, [orders]);

  return {
    loadOrdersFromLocalStorage,
    saveOrdersToLocalStorage
  };
};

// Save orders to localStorage
export const saveOrdersToLocalStorage = (orders: Order[]): void => {
  try {
    localStorage.setItem('tmcavto_orders', JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
  }
};

// Load orders from localStorage
export const loadOrdersFromLocalStorage = (): Order[] => {
  try {
    const orders = localStorage.getItem('tmcavto_orders');
    if (!orders) return [];
    return JSON.parse(orders) as Order[];
  } catch (error) {
    console.error('Error loading orders from localStorage:', error);
    return [];
  }
};
