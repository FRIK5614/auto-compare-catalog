
import { fetchAllCars, fetchOrders } from "@/services/api";
import { Car, Order } from "@/types/car";
import { loadFavoritesFromLocalStorage, loadOrdersFromLocalStorage } from "./utils";
import { databaseService } from "@/services/database/DatabaseProvider";

// Load cars from API
export const loadCars = async (): Promise<Car[]> => {
  try {
    // Используем абстракцию базы данных для загрузки автомобилей
    const data = await databaseService.getCars();
    console.log("Loaded cars from database:", data.length);
    return data;
  } catch (err) {
    console.error("Failed to load cars:", err);
    throw new Error("Не удалось загрузить данные об автомобилях");
  }
};

// Load orders from database or localStorage
export const loadOrders = async (): Promise<Order[]> => {
  try {
    const ordersData = await databaseService.getOrders();
    
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
    console.error("Failed to load orders from database:", err);
    return loadOrdersFromLocalStorage();
  }
};

// Load favorites from database or localStorage
export const loadFavorites = async (): Promise<string[]> => {
  try {
    // Используем абстракцию базы данных для загрузки избранного
    return await databaseService.getFavorites();
  } catch (err) {
    console.error("Failed to load favorites from database:", err);
    return loadFavoritesFromLocalStorage();
  }
};
