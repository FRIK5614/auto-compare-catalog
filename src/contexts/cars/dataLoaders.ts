// Import the correct orderAPI function
import { orderAPI } from "@/services/api/orderAPI";
import { Car, Order } from "@/types/car";
import { fetchCars } from "@/services/api";
import { saveCarsToLocalStorage, saveFavoritesToLocalStorage, saveOrdersToLocalStorage } from "./utils";

// Load cars
export const loadCars = async (): Promise<Car[]> => {
  try {
    console.log("Loading cars from API...");
    const cars = await fetchCars();
    console.log(`Loaded ${cars.length} cars`);
    saveCarsToLocalStorage(cars);
    return cars;
  } catch (error) {
    console.error("Error loading cars:", error);
    return [];
  }
};

// Load favorites
export const loadFavorites = async (): Promise<string[]> => {
  try {
    console.log("Loading favorites from local storage...");
    const favorites = localStorage.getItem("favoriteCars");
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
};

// Load orders
export const loadOrders = async (): Promise<Order[]> => {
  try {
    console.log("Loading orders from API...");
    // Use the orderAPI.getAllOrders function instead of fetchOrders
    const orders = await orderAPI.getAllOrders();
    console.log(`Loaded ${orders.length} orders`);
    return orders;
  } catch (error) {
    console.error("Error loading orders:", error);
    return [];
  }
};
