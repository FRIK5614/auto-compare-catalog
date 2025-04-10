
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Car, CarFilter, Order } from "../../types/car";
import { useToast } from "@/hooks/use-toast";
import { CarsContextType } from "./types";
import { loadCars, loadFavorites, loadOrders } from "./dataLoaders";
import { saveCompareToLocalStorage, loadCompareFromLocalStorage } from "./utils";
import { addToFavorites, removeFromFavorites } from "./favoriteActions";
import { addToCompare, removeFromCompare, clearCompare as clearCompareAction } from "./compareActions";
import { viewCar as viewCarAction, deleteCar as deleteCarAction, updateCar as updateCarAction, addCar as addCarAction, uploadCarImage as uploadCarImageAction, importCarsData as importCarsDataAction } from "./carActions";
import { processOrder as processOrderAction } from "./orderActions";
import { applyFilters } from "./filterActions";

const CarsContext = createContext<CarsContextType | undefined>(undefined);

export const CarsProvider = ({ children }: { children: ReactNode }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareCars, setCompareCars] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<CarFilter>({});
  const { toast } = useToast();

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load cars
        const carsData = await loadCars();
        setCars(carsData);
        setFilteredCars(carsData);
        
        // Load orders
        const ordersData = await loadOrders();
        setOrders(ordersData);
        
        // Load favorites
        const favoritesData = await loadFavorites();
        setFavorites(favoritesData);
        
        // Load compare cars
        const compareData = loadCompareFromLocalStorage();
        setCompareCars(compareData);
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to initialize data:", err);
        const errorMessage = err instanceof Error ? err.message : "Не удалось загрузить данные";
        setError(errorMessage);
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Ошибка загрузки",
          description: errorMessage
        });
      }
    };

    initializeData();
  }, [toast]);

  // Save compare cars to localStorage whenever it changes
  useEffect(() => {
    saveCompareToLocalStorage(compareCars);
  }, [compareCars]);

  // Apply filters whenever cars or filter changes
  useEffect(() => {
    const result = applyFilters(cars, filter);
    setFilteredCars(result);
  }, [cars, filter]);

  // Function to reload cars
  const reloadCars = async () => {
    try {
      setLoading(true);
      const data = await loadCars();
      setCars(data);
      toast({
        title: "Данные обновлены",
        description: "Каталог автомобилей успешно обновлен"
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to reload cars:", err);
      const errorMessage = err instanceof Error ? err.message : "Не удалось перезагрузить данные";
      setError(errorMessage);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Ошибка обновления",
        description: errorMessage
      });
    }
  };

  // Fetch car by ID
  const getCarById = (id: string) => {
    return cars.find(car => car.id === id);
  };

  // Handle adding to favorites
  const handleAddToFavorites = async (carId: string) => {
    const result = await addToFavorites(
      carId, 
      favorites, 
      (newFavorites) => setFavorites(newFavorites),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
  };

  // Handle removing from favorites
  const handleRemoveFromFavorites = async (carId: string) => {
    const result = await removeFromFavorites(
      carId, 
      favorites, 
      (newFavorites) => setFavorites(newFavorites),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
  };

  // Handle adding to compare
  const handleAddToCompare = (carId: string) => {
    const result = addToCompare(
      carId, 
      compareCars, 
      (newCompareCars) => setCompareCars(newCompareCars),
      () => toast({
        variant: "destructive",
        title: "Ограничение сравнения",
        description: "Можно сравнивать не более 3 автомобилей одновременно"
      })
    );
    
    if (result) {
      toast(result);
    }
  };

  // Handle removing from compare
  const handleRemoveFromCompare = (carId: string) => {
    const result = removeFromCompare(
      carId, 
      compareCars, 
      (newCompareCars) => setCompareCars(newCompareCars)
    );
    
    if (result) {
      toast(result);
    }
  };

  // Handle clearing compare
  const clearCompare = () => {
    const result = clearCompareAction(() => setCompareCars([]));
    
    if (result) {
      toast(result);
    }
  };

  // Create an index.ts that exports all the functions from other files
  const viewCar = (carId: string) => {
    viewCarAction(carId, cars, (updatedCars) => setCars(updatedCars));
  };

  const handleDeleteCar = async (carId: string) => {
    const result = await deleteCarAction(
      carId, 
      cars, 
      (updatedCars) => setCars(updatedCars),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
  };

  const handleUpdateCar = async (updatedCar: Car) => {
    const result = await updateCarAction(
      updatedCar, 
      cars, 
      (updatedCars) => setCars(updatedCars),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
  };

  const handleAddCar = async (newCar: Car) => {
    const result = await addCarAction(
      newCar, 
      cars, 
      (updatedCars) => setCars(updatedCars),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
  };

  const handleProcessOrder = async (orderId: string, status: Order['status']) => {
    const result = await processOrderAction(
      orderId, 
      status, 
      orders, 
      (updatedOrders) => setOrders(updatedOrders),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
  };

  const getOrders = () => {
    return orders;
  };

  const exportCarsData = (): string => {
    return JSON.stringify(cars, null, 2);
  };

  const handleImportCarsData = async (data: string) => {
    return await importCarsDataAction(
      data,
      (parsedData) => {
        setCars(parsedData);
        setFilteredCars(parsedData);
        toast({
          title: "Импорт завершен",
          description: `Импортировано ${parsedData.length} автомобилей`
        });
      },
      (message) => toast({ variant: "destructive", title: "Ошибка импорта", description: message })
    );
  };

  const handleUploadCarImage = async (file: File): Promise<string> => {
    try {
      const url = await uploadCarImageAction(file);
      toast({
        title: "Изображение загружено",
        description: "Изображение успешно загружено на сервер"
      });
      return url;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: "Не удалось загрузить изображение. Попробуйте еще раз."
      });
      throw err;
    }
  };

  return (
    <CarsContext.Provider
      value={{
        cars,
        filteredCars,
        favorites,
        compareCars,
        orders,
        loading,
        error,
        filter,
        setFilter,
        addToFavorites: handleAddToFavorites,
        removeFromFavorites: handleRemoveFromFavorites,
        addToCompare: handleAddToCompare,
        removeFromCompare: handleRemoveFromCompare,
        clearCompare,
        getCarById,
        reloadCars,
        viewCar,
        deleteCar: handleDeleteCar,
        updateCar: handleUpdateCar,
        addCar: handleAddCar,
        processOrder: handleProcessOrder,
        getOrders,
        exportCarsData,
        importCarsData: handleImportCarsData,
        uploadCarImage: handleUploadCarImage
      }}
    >
      {children}
    </CarsContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarsContext);
  if (context === undefined) {
    throw new Error("useCars must be used within a CarsProvider");
  }
  return context;
};
