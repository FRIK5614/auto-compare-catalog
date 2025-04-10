
import { Car, Order } from "@/types/car";
import { supabaseProvider } from "./providers/supabaseProvider";

// Интерфейс провайдера базы данных
export interface DatabaseProvider {
  // Автомобили
  getCars(): Promise<Car[]>;
  getCarById(id: string): Promise<Car | null>;
  searchCars(searchParams: Record<string, any>): Promise<Car[]>;
  saveCar(car: Car): Promise<Car>;
  updateCar(car: Car): Promise<Car>;
  deleteCar(carId: string): Promise<boolean>;
  incrementCarViewCount(carId: string): Promise<void>;
  
  // Заказы
  getOrders(): Promise<any[]>;
  submitPurchaseRequest(formData: Record<string, any>): Promise<{ success: boolean; message: string }>;
  updateOrderStatus(orderId: string, status: string): Promise<boolean>;
  
  // Бренды
  getBrands(): Promise<string[]>;
  
  // Избранное
  getFavorites(): Promise<string[]>;
  saveFavorites(favorites: string[]): Promise<boolean>;
}

// Текущий провайдер базы данных
// В будущем это значение можно будет изменить на другой провайдер
let currentProvider: DatabaseProvider = supabaseProvider;

// Функция для настройки другого провайдера базы данных
export const setDatabaseProvider = (provider: DatabaseProvider): void => {
  currentProvider = provider;
};

// Экспортируем функции провайдера для использования в приложении
export const databaseService = {
  // Автомобили
  getCars: () => currentProvider.getCars(),
  getCarById: (id: string) => currentProvider.getCarById(id),
  searchCars: (searchParams: Record<string, any>) => currentProvider.searchCars(searchParams),
  saveCar: (car: Car) => currentProvider.saveCar(car),
  updateCar: (car: Car) => currentProvider.updateCar(car),
  deleteCar: (carId: string) => currentProvider.deleteCar(carId),
  incrementCarViewCount: (carId: string) => currentProvider.incrementCarViewCount(carId),
  
  // Заказы
  getOrders: () => currentProvider.getOrders(),
  submitPurchaseRequest: (formData: Record<string, any>) => currentProvider.submitPurchaseRequest(formData),
  updateOrderStatus: (orderId: string, status: string) => currentProvider.updateOrderStatus(orderId, status),
  
  // Бренды
  getBrands: () => currentProvider.getBrands(),
  
  // Избранное
  getFavorites: () => currentProvider.getFavorites(),
  saveFavorites: (favorites: string[]) => currentProvider.saveFavorites(favorites),
};
