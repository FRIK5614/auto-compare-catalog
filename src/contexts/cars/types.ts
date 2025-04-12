
import { Car, Order, CarImage } from "@/types/car";

export type FilterOptions = {
  limit?: number;
  search?: string;
  brands?: string[];
  bodyTypes?: string[];
  priceRange?: [number, number];
  yearRange?: [number, number];
  fuelTypes?: string[];
  transmissionTypes?: string[];
  isNew?: boolean;
  country?: string;
  sortBy?: 'price' | 'year' | 'popularity';
  sortOrder?: 'asc' | 'desc';
};

export interface CarsContextType {
  // Данные автомобилей и состояние
  cars: Car[];
  filteredCars: Car[];
  favorites: string[];
  compareCars: string[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  isOnline?: boolean;
  
  // Фильтрация
  filter: FilterOptions;
  setFilter: (filter: FilterOptions) => void;
  
  // Действия с избранным
  addToFavorites: (carId: string) => Promise<void> | void;
  removeFromFavorites: (carId: string) => Promise<void> | void;
  refreshFavorites?: () => void;
  
  // Действия со сравнением
  addToCompare: (carId: string) => void;
  removeFromCompare: (carId: string) => void;
  clearCompare: () => void;
  
  // CRUD операции с автомобилями
  getCarById: (id: string) => Car | undefined;
  reloadCars: () => Promise<Car[]>;
  viewCar: (id: string) => Promise<Car | undefined>;
  deleteCar: (id: string) => Promise<boolean>;
  updateCar: (car: Car) => Promise<Car>;
  addCar: (car: Partial<Car>) => Promise<Car>;
  
  // Операции с заказами
  processOrder: (orderId: string, status: Order['status']) => Promise<boolean>;
  getOrders: () => Order[];
  reloadOrders: () => Promise<void>;
  
  // Экспорт и импорт данных
  exportCarsData: () => Promise<string>;
  importCarsData: (data: string) => Promise<Car[]>;
  
  // Загрузка изображений
  uploadCarImage: (file: File, carId: string) => Promise<CarImage>;
}
