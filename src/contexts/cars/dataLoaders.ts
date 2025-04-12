
import { Car, Order } from "@/types/car";
import { fetchAllCars, fetchCarsByCountryWithFallback } from "@/services/api/carAPI";
import { fetchOrders } from "@/services/api/orderAPI";
import { loadFavoritesFromLocalStorage } from "./utils";

// Загрузка заказов
export const loadOrders = async (): Promise<Order[]> => {
  try {
    const orders = await fetchOrders();
    console.log("Loaded orders from fetchOrders:", orders);
    return orders;
  } catch (error) {
    console.error("Error loading orders:", error);
    return [];
  }
};

// Загрузка всех автомобилей
export const loadAllCars = async (): Promise<Car[]> => {
  try {
    const cars = await fetchAllCars();
    console.log("Loaded cars from database:", cars.length);
    return cars;
  } catch (error) {
    console.error("Error loading cars:", error);
    return [];
  }
};

// Загрузка автомобилей по стране
export const loadCarsByCountry = async (country: string): Promise<Car[]> => {
  try {
    const cars = await fetchCarsByCountryWithFallback(country);
    console.log(`Loaded ${cars.length} cars from ${country}`);
    return cars;
  } catch (error) {
    console.error(`Error loading cars from ${country}:`, error);
    return [];
  }
};

// Экспортируем функцию загрузки избранного
export const loadFavorites = async (): Promise<string[]> => {
  try {
    // Здесь можно добавить логику загрузки избранного из Supabase
    // Пока используем локальное хранилище
    return loadFavoritesFromLocalStorage();
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
};

// Экспортируем функцию загрузки автомобилей
export const loadCars = async (): Promise<Car[]> => {
  return loadAllCars();
};
