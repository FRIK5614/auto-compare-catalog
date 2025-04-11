
import { Car, CarFilter, Order } from "@/types/car";

export interface CarsContextType {
  // Car data
  cars: Car[];
  filteredCars: Car[];
  favorites: string[];
  compareCars: string[];
  orders: Order[];
  loading: boolean;
  error: string;
  
  // Filtering
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
  
  // Favorites
  addToFavorites: (carId: string) => void;
  removeFromFavorites: (carId: string) => void;
  
  // Compare
  addToCompare: (carId: string) => void;
  removeFromCompare: (carId: string) => void;
  clearCompare: () => void;
  
  // Car details and CRUD
  getCarById: (id: string) => Car | undefined;
  reloadCars: () => Promise<Car[]>;
  viewCar: (carId: string) => void;
  deleteCar: (carId: string) => Promise<boolean>;
  updateCar: (car: Car) => Promise<boolean>;
  addCar: (car: Car) => Promise<boolean>;
  
  // Orders
  processOrder: (orderId: string, status: Order['status']) => Promise<any>;
  getOrders: () => Order[];
  reloadOrders: () => Promise<void>; // Add this to fix the error
  
  // Import/Export
  exportCarsData: () => void;
  importCarsData: (jsonData: string) => Promise<boolean>;
  
  // Image handling
  uploadCarImage: (carId: string, file: File) => Promise<string>;
}
