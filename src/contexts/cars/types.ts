
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
  addToFavorites: (carId: string) => void;
  removeFromFavorites: (carId: string) => void;
  addToCompare: (carId: string) => void;
  removeFromCompare: (carId: string) => void;
  clearCompare: () => void;
  getCarById: (id: string) => Car | undefined;
  reloadCars: () => Promise<void>;
  viewCar: (carId: string) => void;
  deleteCar: (carId: string) => void;
  updateCar: (car: Car) => void;
  addCar: (car: Car) => void;
  processOrder: (orderId: string, status: Order['status']) => void;
  getOrders: () => Order[];
  exportCarsData: () => string;
  importCarsData: (data: string) => boolean;
  uploadCarImage: (file: File) => Promise<string>;
}
