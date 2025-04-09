
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Car, CarFilter, Order } from "../types/car";
import { fetchAllCars, fetchOrders, saveCar, updateCar, deleteCar, updateOrderStatus, incrementCarViewCount } from "../services/api";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CarsContextType {
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
}

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

  // Загрузка заказов из Supabase
  const loadOrders = async () => {
    try {
      const ordersData = await fetchOrders();
      
      // Преобразуем в формат Order
      const formattedOrders: Order[] = ordersData.map(order => ({
        id: order.id,
        carId: order.car_id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        status: order.status as Order['status'],
        createdAt: order.created_at
      }));
      
      setOrders(formattedOrders);
    } catch (err) {
      console.error("Failed to load orders from Supabase:", err);
      
      // Проверяем, есть ли данные в localStorage (для обратной совместимости)
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch (err) {
          console.error("Failed to parse saved orders:", err);
        }
      }
    }
  };

  // Загрузка избранного из Supabase
  const loadFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('car_id');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const favoriteIds = data.map(item => item.car_id);
        setFavorites(favoriteIds);
      } else {
        // Проверяем, есть ли данные в localStorage (для обратной совместимости)
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      }
    } catch (err) {
      console.error("Failed to load favorites from Supabase:", err);
      
      // Используем localStorage как запасной вариант
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  };

  // Загрузка сравнения из localStorage (пока оставляем в localStorage)
  useEffect(() => {
    const savedCompareCars = localStorage.getItem("compareCars");
    if (savedCompareCars) {
      setCompareCars(JSON.parse(savedCompareCars));
    }
  }, []);

  // Сохранение сравнения в localStorage
  useEffect(() => {
    localStorage.setItem("compareCars", JSON.stringify(compareCars));
  }, [compareCars]);

  const loadCars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchAllCars();
      console.log("Loaded cars from API:", data.length);
      setCars(data);
      setFilteredCars(data);
      
      // Загружаем заказы
      await loadOrders();
      
      // Загружаем избранное
      await loadFavorites();
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to load cars:", err);
      const errorMessage = "Не удалось загрузить данные об автомобилях";
      setError(errorMessage);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: errorMessage
      });
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const reloadCars = async () => {
    await loadCars();
  };

  // Фильтрация автомобилей
  useEffect(() => {
    let result = [...cars];

    if (filter.brands && filter.brands.length > 0) {
      result = result.filter(car => filter.brands?.includes(car.brand));
    }

    if (filter.models && filter.models.length > 0) {
      result = result.filter(car => filter.models?.includes(car.model));
    }

    if (filter.years && filter.years.length > 0) {
      result = result.filter(car => filter.years?.includes(car.year));
    }

    if (filter.bodyTypes && filter.bodyTypes.length > 0) {
      result = result.filter(car => filter.bodyTypes?.includes(car.bodyType));
    }

    if (filter.priceRange) {
      result = result.filter(
        car => 
          car.price.base >= (filter.priceRange?.min || 0) && 
          car.price.base <= (filter.priceRange?.max || Infinity)
      );
    }

    if (filter.engineTypes && filter.engineTypes.length > 0) {
      result = result.filter(car => filter.engineTypes?.includes(car.engine.type));
    }

    if (filter.drivetrains && filter.drivetrains.length > 0) {
      result = result.filter(car => filter.drivetrains?.includes(car.drivetrain));
    }

    if (filter.isNew !== undefined) {
      result = result.filter(car => car.isNew === filter.isNew);
    }
    
    if (filter.countries && filter.countries.length > 0) {
      result = result.filter(car => car.country && filter.countries?.includes(car.country));
    }

    setFilteredCars(result);
  }, [cars, filter]);

  // Добавление в избранное
  const addToFavorites = async (carId: string) => {
    if (!favorites.includes(carId)) {
      try {
        // Добавляем в Supabase
        const { error } = await supabase
          .from('favorites')
          .insert({
            car_id: carId,
            user_id: 'anonymous' // Временное решение, в будущем будет использоваться auth.uid()
          });
        
        if (error) {
          throw error;
        }
        
        // Обновляем состояние
        setFavorites([...favorites, carId]);
        
        toast({
          title: "Добавлено в избранное",
          description: "Автомобиль добавлен в список избранного"
        });
      } catch (err) {
        console.error("Failed to add to favorites:", err);
        
        // Используем локальное состояние как запасной вариант
        setFavorites([...favorites, carId]);
        
        toast({
          title: "Добавлено в избранное",
          description: "Автомобиль добавлен в список избранного (локально)"
        });
      }
    }
  };

  // Удаление из избранного
  const removeFromFavorites = async (carId: string) => {
    try {
      // Удаляем из Supabase
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('car_id', carId)
        .eq('user_id', 'anonymous');
      
      if (error) {
        throw error;
      }
      
      // Обновляем состояние
      setFavorites(favorites.filter(id => id !== carId));
      
      toast({
        title: "Удалено из избранного",
        description: "Автомобиль удален из списка избранного"
      });
    } catch (err) {
      console.error("Failed to remove from favorites:", err);
      
      // Используем локальное состояние как запасной вариант
      setFavorites(favorites.filter(id => id !== carId));
      
      toast({
        title: "Удалено из избранного",
        description: "Автомобиль удален из списка избранного (локально)"
      });
    }
  };

  const addToCompare = (carId: string) => {
    if (!compareCars.includes(carId) && compareCars.length < 3) {
      setCompareCars([...compareCars, carId]);
      toast({
        title: "Добавлено к сравнению",
        description: "Автомобиль добавлен к сравнению"
      });
    } else if (compareCars.length >= 3) {
      toast({
        variant: "destructive",
        title: "Ограничение сравнения",
        description: "Можно сравнивать не более 3 автомобилей одновременно"
      });
    }
  };

  const removeFromCompare = (carId: string) => {
    setCompareCars(compareCars.filter(id => id !== carId));
    toast({
      title: "Удалено из сравнения",
      description: "Автомобиль удален из списка сравнения"
    });
  };

  const clearCompare = () => {
    setCompareCars([]);
    toast({
      title: "Список сравнения очищен",
      description: "Все автомобили удалены из списка сравнения"
    });
  };

  const getCarById = (id: string) => {
    return cars.find(car => car.id === id);
  };

  // Просмотр автомобиля
  const viewCar = async (carId: string) => {
    try {
      // Увеличиваем счетчик просмотров в Supabase
      await incrementCarViewCount(carId);
      
      // Обновляем локальное состояние
      setCars(prevCars => 
        prevCars.map(car => 
          car.id === carId 
            ? { ...car, viewCount: (car.viewCount || 0) + 1 } 
            : car
        )
      );
    } catch (err) {
      console.error("Failed to update view count:", err);
      
      // Используем локальное состояние как запасной вариант
      setCars(prevCars => 
        prevCars.map(car => 
          car.id === carId 
            ? { ...car, viewCount: (car.viewCount || 0) + 1 } 
            : car
        )
      );
    }
  };

  // Удаление автомобиля
  const deleteCar = async (carId: string) => {
    try {
      // Удаляем из Supabase
      await deleteCar(carId);
      
      // Обновляем локальное состояние
      setCars(prevCars => prevCars.filter(car => car.id !== carId));
      
      toast({
        title: "Автомобиль удален",
        description: "Автомобиль был успешно удален из каталога"
      });
    } catch (err) {
      console.error("Failed to delete car:", err);
      
      // Используем локальное состояние как запасной вариант
      setCars(prevCars => prevCars.filter(car => car.id !== carId));
      
      toast({
        title: "Автомобиль удален",
        description: "Автомобиль был успешно удален из каталога (локально)"
      });
    }
  };

  // Обновление автомобиля
  const updateCar = async (updatedCar: Car) => {
    try {
      // Обновляем в Supabase
      await updateCar(updatedCar);
      
      // Обновляем локальное состояние
      setCars(prevCars => 
        prevCars.map(car => 
          car.id === updatedCar.id ? updatedCar : car
        )
      );
      
      toast({
        title: "Автомобиль обновлен",
        description: "Информация об автомобиле была успешно обновлена"
      });
    } catch (err) {
      console.error("Failed to update car:", err);
      
      // Используем локальное состояние как запасной вариант
      setCars(prevCars => 
        prevCars.map(car => 
          car.id === updatedCar.id ? updatedCar : car
        )
      );
      
      toast({
        title: "Автомобиль обновлен",
        description: "Информация об автомобиле была успешно обновлена (локально)"
      });
    }
  };

  // Добавление автомобиля
  const addCar = async (newCar: Car) => {
    try {
      // Сохраняем в Supabase
      const savedCar = await saveCar(newCar);
      
      // Обновляем локальное состояние с сохраненным автомобилем
      setCars(prevCars => [...prevCars, savedCar]);
      
      toast({
        title: "Автомобиль добавлен",
        description: "Новый автомобиль был успешно добавлен в каталог"
      });
    } catch (err) {
      console.error("Failed to add car:", err);
      
      // Используем локальное состояние как запасной вариант
      setCars(prevCars => [...prevCars, newCar]);
      
      toast({
        title: "Автомобиль добавлен",
        description: "Новый автомобиль был успешно добавлен в каталог (локально)"
      });
    }
  };

  // Обработка заказа
  const processOrder = async (orderId: string, status: Order['status']) => {
    try {
      // Обновляем статус в Supabase
      const success = await updateOrderStatus(orderId, status);
      
      if (!success) {
        throw new Error("Failed to update order status");
      }
      
      // Обновляем локальное состояние
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      
      setOrders(updatedOrders);
      
      toast({
        title: "Заказ обновлен",
        description: `Статус заказа изменен на: ${status}`
      });
    } catch (err) {
      console.error("Failed to process order:", err);
      
      // Используем локальное состояние как запасной вариант
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      
      setOrders(updatedOrders);
      
      // Сохраняем в localStorage для обратной совместимости
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      
      toast({
        title: "Заказ обновлен",
        description: `Статус заказа изменен на: ${status} (локально)`
      });
    }
  };

  const getOrders = () => {
    return orders;
  };

  const exportCarsData = (): string => {
    return JSON.stringify(cars, null, 2);
  };

  const importCarsData = (data: string): boolean => {
    try {
      const parsedData = JSON.parse(data);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        setCars(parsedData);
        setFilteredCars(parsedData);
        
        // Сохраняем данные в Supabase
        try {
          const vehicles = parsedData.map((car: Car) => ({
            id: car.id,
            brand: car.brand,
            model: car.model,
            year: car.year,
            body_type: car.bodyType,
            colors: car.colors,
            price: car.price.base,
            price_discount: car.price.discount,
            engine_type: car.engine.type,
            engine_capacity: car.engine.displacement,
            engine_power: car.engine.power,
            engine_torque: car.engine.torque,
            engine_fuel_type: car.engine.fuelType,
            transmission_type: car.transmission.type,
            transmission_gears: car.transmission.gears,
            drivetrain: car.drivetrain,
            dimensions: car.dimensions,
            performance: car.performance,
            features: car.features,
            image_url: car.images && car.images.length > 0 ? car.images[0].url : null,
            description: car.description,
            is_new: car.isNew,
            country: car.country,
            view_count: car.viewCount || 0
          }));
          
          // Удаляем все существующие автомобили
          supabase.from('vehicles').delete().then(() => {
            // Добавляем новые
            supabase.from('vehicles').insert(vehicles);
          });
        } catch (err) {
          console.error("Failed to save imported data to Supabase:", err);
        }
        
        toast({
          title: "Импорт завершен",
          description: `Импортировано ${parsedData.length} автомобилей`
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка импорта",
          description: "Данные не содержат автомобилей или имеют неверный формат"
        });
        return false;
      }
    } catch (error) {
      console.error("Import error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка импорта",
        description: "Не удалось разобрать JSON данные"
      });
      return false;
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
        addToFavorites,
        removeFromFavorites,
        addToCompare,
        removeFromCompare,
        clearCompare,
        getCarById,
        reloadCars,
        viewCar,
        deleteCar,
        updateCar,
        addCar,
        processOrder,
        getOrders,
        exportCarsData,
        importCarsData
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
