
import { supabase } from "@/integrations/supabase/client";
import { fetchAllCars, fetchOrders } from "@/services/api";
import { Car, Order } from "@/types/car";
import { loadFavoritesFromLocalStorage, loadOrdersFromLocalStorage } from "./utils";

// Load cars from API
export const loadCars = async (): Promise<Car[]> => {
  try {
    const data = await fetchAllCars();
    console.log("Loaded cars from API:", data.length);
    return data;
  } catch (err) {
    console.error("Failed to load cars:", err);
    throw new Error("Не удалось загрузить данные об автомобилях");
  }
};

// Load orders from Supabase or localStorage
export const loadOrders = async (): Promise<Order[]> => {
  try {
    const ordersData = await fetchOrders();
    
    const formattedOrders: Order[] = ordersData.map(order => ({
      id: order.id,
      carId: order.car_id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email,
      status: order.status as Order['status'],
      createdAt: order.created_at
    }));
    
    return formattedOrders;
  } catch (err) {
    console.error("Failed to load orders from Supabase:", err);
    return loadOrdersFromLocalStorage();
  }
};

// Load favorites from Supabase or localStorage
export const loadFavorites = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('car_id');
    
    if (error) {
      throw error;
    }
    
    if (data && data.length > 0) {
      const favoriteIds = data.map(item => item.car_id);
      return favoriteIds;
    } else {
      return loadFavoritesFromLocalStorage();
    }
  } catch (err) {
    console.error("Failed to load favorites from Supabase:", err);
    return loadFavoritesFromLocalStorage();
  }
};
