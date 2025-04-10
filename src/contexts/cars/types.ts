
import { Car, CarFilter, Order } from "@/types/car";

export interface CarsContextType {
  cars: Car[];
  filteredCars: Car[];
  favorites: string[];
  compareCars: string[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
  addToFavorites: (carId: string) => Promise<void>;
  removeFromFavorites: (carId: string) => Promise<void>;
  addToCompare: (carId: string) => void;
  removeFromCompare: (carId: string) => void;
  clearCompare: () => void;
  getCarById: (id: string) => Car | undefined;
  reloadCars: () => Promise<void>;
  viewCar: (carId: string) => void;
  deleteCar: (carId: string) => Promise<void>;
  updateCar: (car: Car) => Promise<void>;
  addCar: (car: Car) => Promise<void>;
  processOrder: (orderId: string, status: Order['status']) => Promise<void>;
  getOrders: () => Order[];
  exportCarsData: () => string;
  importCarsData: (data: string) => Promise<boolean>;
  uploadCarImage: (file: File) => Promise<string>;
}
