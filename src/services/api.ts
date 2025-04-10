import { Car } from '../types/car';
import { supabase } from '@/integrations/supabase/client';

// Базовый URL для API (оставлен для совместимости)
const BASE_URL = 'https://catalog.tmcavto.ru';

/**
 * Получение данных о всех автомобилях из Supabase
 */
export const fetchAllCars = async (): Promise<Car[]> => {
  try {
    console.log('[API] Загрузка автомобилей из Supabase');
    
    // Получаем данные из Supabase
    const { data, error } = await supabase
      .from('vehicles')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    console.log(`[API] Получено ${data?.length || 0} автомобилей из Supabase`);
    
    if (!data || data.length === 0) {
      console.log('[API] В базе данных нет автомобилей');
      return [];
    }
    
    // Преобразуем данные из формата Supabase в формат Car
    const cars: Car[] = data.map(vehicle => transformVehicleToCar(vehicle));
    
    console.log(`[API] Получено ${cars.length} автомобилей из Supabase`);
    return cars;
  } catch (error) {
    console.error("Ошибка при получении данных об автомобилях:", error);
    throw new Error("Не удалось загрузить данные об автомобилях из базы данных");
  }
};

/**
 * Получение детальной информации об автомобиле по ID из Supabase
 */
export const fetchCarById = async (id: string): Promise<Car | null> => {
  try {
    console.log(`[API] Загрузка автомобиля с ID ${id} из Supabase`);
    
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`[API] Автомобиль с ID ${id} не найден в Supabase`);
        return null;
      }
      throw error;
    }
    
    if (!data) {
      console.log(`[API] Автомобиль с ID ${id} не найден в Supabase`);
      return null;
    }
    
    // Преобразуем данные из формата Supabase в формат Car
    const car = transformVehicleToCar(data);
    
    console.log(`[API] Получены данные об автомобиле: ${car.brand} ${car.model}`);
    return car;
  } catch (error) {
    console.error(`Ошибка при получении данных об автомобиле с ID ${id}:`, error);
    throw new Error("Не удалось загрузить данные об автомобиле из базы данных");
  }
};

/**
 * Поиск автомобилей по параметрам в Supabase
 */
export const searchCars = async (searchParams: Record<string, any>): Promise<Car[]> => {
  try {
    console.log(`[API] Поиск автомобилей в Supabase с параметрами:`, searchParams);
    
    let query = supabase.from('vehicles').select('*');
    
    // Добавляем фильтры к запросу
    if (searchParams.brand) {
      query = query.eq('brand', searchParams.brand);
    }
    
    if (searchParams.model) {
      query = query.eq('model', searchParams.model);
    }
    
    if (searchParams.year) {
      query = query.eq('year', searchParams.year);
    }
    
    if (searchParams.minPrice) {
      query = query.gte('price', searchParams.minPrice);
    }
    
    if (searchParams.maxPrice) {
      query = query.lte('price', searchParams.maxPrice);
    }
    
    if (searchParams.bodyType) {
      query = query.eq('body_type', searchParams.bodyType);
    }
    
    if (searchParams.isNew !== undefined) {
      query = query.eq('is_new', searchParams.isNew);
    }
    
    if (searchParams.country) {
      query = query.eq('country', searchParams.country);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('[API] Нет результатов поиска в Supabase');
      return [];
    }
    
    // Преобразуем данные из формата Supabase в формат Car
    const cars: Car[] = data.map(vehicle => transformVehicleToCar(vehicle));
    
    console.log(`[API] Найдено ${cars.length} автомобилей в Supabase`);
    return cars;
  } catch (error) {
    console.error("Ошибка при поиске автомобилей:", error);
    throw new Error("Не удалось выполнить поиск автомобилей в базе данных");
  }
};

/**
 * Получение списка доступных брендов из Supabase
 */
export const fetchBrands = async (): Promise<string[]> => {
  try {
    console.log(`[API] Загрузка списка брендов из Supabase`);
    
    const { data, error } = await supabase
      .from('vehicles')
      .select('brand')
      .order('brand');
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('[API] Нет брендов в Supabase, используем локальные данные');
      const { carsData } = await import('../data/carsData');
      const brands = [...new Set(carsData.map(car => car.brand))];
      return brands;
    }
    
    // Извлекаем уникальные бренды
    const brands = [...new Set(data.map(item => item.brand))];
    
    console.log(`[API] Получено ${brands.length} брендов из Supabase`);
    return brands;
  } catch (error) {
    console.error("Ошибка при получении списка брендов:", error);
    
    // В случае ошибки используем локальные данные
    const { carsData } = await import('../data/carsData');
    const brands = [...new Set(carsData.map(car => car.brand))];
    return brands;
  }
};

/**
 * Отправка заявки на покупку в Supabase
 */
export const submitPurchaseRequest = async (formData: Record<string, any>): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`[API] Отправка заявки на покупку в Supabase:`, formData);
    
    const order = {
      car_id: formData.carId,
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_email: formData.email,
      status: 'new'
    };
    
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    console.log(`[API] Заявка успешно отправлена в Supabase`);
    return {
      success: true,
      message: "Ваша заявка успешно отправлена. Наш менеджер свяжется с вами в ближайшее время."
    };
  } catch (error) {
    console.error("Ошибка при отправке заявки:", error);
    return {
      success: false,
      message: "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже."
    };
  }
};

/**
 * Функция для преобразования объекта из таблицы vehicles в формат Car
 */
const transformVehicleToCar = (vehicle: any): Car => {
  // Создаем базовый объект Car
  const car: Car = {
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    bodyType: vehicle.body_type || 'Не указан',
    colors: vehicle.colors || ['Белый'],
    price: {
      base: vehicle.price || 0,
      discount: vehicle.price_discount
    },
    engine: {
      type: vehicle.engine_type || 'Бензиновый',
      displacement: vehicle.engine_capacity || 1.6,
      power: vehicle.engine_power || 100,
      torque: vehicle.engine_torque || 150,
      fuelType: vehicle.engine_fuel_type || 'Бензин'
    },
    transmission: {
      type: vehicle.transmission_type || 'Автоматическая',
      gears: vehicle.transmission_gears || 6
    },
    drivetrain: vehicle.drivetrain || 'Передний',
    dimensions: vehicle.dimensions || {
      length: 4500,
      width: 1800,
      height: 1500,
      wheelbase: 2700,
      weight: 1500,
      trunkVolume: 400
    },
    performance: vehicle.performance || {
      acceleration: 10,
      topSpeed: 180,
      fuelConsumption: {
        city: 10,
        highway: 7,
        combined: 8.5
      }
    },
    features: vehicle.features ? JSON.parse(vehicle.features) : [],
    images: [
      {
        id: `img-${vehicle.id}-1`,
        url: vehicle.image_url || '/placeholder.svg',
        alt: `${vehicle.brand} ${vehicle.model}`
      }
    ],
    description: vehicle.description || `${vehicle.brand} ${vehicle.model} ${vehicle.year} года`,
    isNew: vehicle.is_new !== undefined ? vehicle.is_new : true,
    country: vehicle.country || 'Не указана',
    viewCount: vehicle.view_count || 0
  };
  
  return car;
};

/**
 * Функция для преобразования объекта Car в формат для сохранения в таблице vehicles
 */
export const transformCarToVehicle = (car: Car): any => {
  return {
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
  };
};

/**
 * Сохранение нового автомобиля в Supabase
 */
export const saveCar = async (car: Car): Promise<Car> => {
  try {
    console.log(`[API] Сохранение автомобиля в Supabase:`, car);
    
    const vehicle = transformCarToVehicle(car);
    
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicle)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    console.log(`[API] Автомобиль успешно сохранен в Supabase`);
    return transformVehicleToCar(data);
  } catch (error) {
    console.error("Ошибка при сохранении автомобиля:", error);
    throw new Error("Не удалось сохранить автомобиль");
  }
};

/**
 * Обновление существующего автомобиля в Supabase
 */
export const updateCar = async (car: Car): Promise<Car> => {
  try {
    console.log(`[API] Обновление автомобиля в Supabase:`, car);
    
    const vehicle = transformCarToVehicle(car);
    
    const { data, error } = await supabase
      .from('vehicles')
      .update(vehicle)
      .eq('id', car.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    console.log(`[API] Автомобиль успешно обновлен в Supabase`);
    return transformVehicleToCar(data);
  } catch (error) {
    console.error("Ошибка при обновлении автомобиля:", error);
    throw new Error("Не удалось обновить автомобиль");
  }
};

/**
 * Удаление автомобиля из Supabase
 */
export const deleteCar = async (carId: string): Promise<boolean> => {
  try {
    console.log(`[API] Удаление автомобиля из Supabase:`, carId);
    
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', carId);
    
    if (error) {
      throw error;
    }
    
    console.log(`[API] Автомобиль успешно удален из Supabase`);
    return true;
  } catch (error) {
    console.error("Ошибка при удалении автомобиля:", error);
    throw new Error("Не удалось удалить автомобиль");
  }
};

/**
 * Увеличение счетчика просмотров автомобиля в Supabase
 */
export const incrementCarViewCount = async (carId: string): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('view_count')
      .eq('id', carId)
      .single();
    
    if (error) {
      throw error;
    }
    
    const currentViewCount = data?.view_count || 0;
    
    const { error: updateError } = await supabase
      .from('vehicles')
      .update({ view_count: currentViewCount + 1 })
      .eq('id', carId);
    
    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error("Ошибка при обновлении счетчика просмотров:", error);
  }
};

/**
 * Получение заказов из Supabase
 */
export const fetchOrders = async (): Promise<any[]> => {
  try {
    console.log(`[API] Загрузка заказов из Supabase`);
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    console.log(`[API] Получено ${data?.length || 0} заказов из Supabase`);
    return data || [];
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    return [];
  }
};

/**
 * Обновление статуса заказа в Supabase
 */
export const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
  try {
    console.log(`[API] Обновление статуса заказа ${orderId} в Supabase на ${status}`);
    
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    
    if (error) {
      throw error;
    }
    
    console.log(`[API] Статус заказа успешно обновлен в Supabase`);
    return true;
  } catch (error) {
    console.error("Ошибка при обновлении статуса заказа:", error);
    return false;
  }
};

/**
 * Обходное решение для получения данных о автомобилях из определенной страны
 * Эта функция пытается использовать API, но если запрос заблокирован, возвращает тестовые данные
 */
export const fetchCarsByCountryWithFallback = async (country: string): Promise<Car[]> => {
  try {
    // Ищем автомобили в Supabase по стране
    console.log(`[API] Загрузка автомобилей из ${country} через Supabase`);
    
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('country', country);
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log(`[API] Нет автомобилей из ${country} в Supabase, генерируем тестовые данные`);
      
      if (country === 'Китай') {
        const mockCars = generateMockCarsForChina(15);
        
        // Сохраняем сгенерированные данные в Supabase
        const vehicles = mockCars.map(car => transformCarToVehicle(car));
        await supabase.from('vehicles').insert(vehicles);
        
        return mockCars;
      }
      
      return [];
    }
    
    // Преобразуем данные из формата Supabase в формат Car
    const cars: Car[] = data.map(vehicle => transformVehicleToCar(vehicle));
    
    console.log(`[API] Получено ${cars.length} автомобилей из ${country} через Supabase`);
    return cars;
  } catch (error) {
    console.error(`Ошибка при получении автомобилей из ${country}:`, error);
    
    // Возвращаем тестовые данные в случае ошибки
    if (country === 'Китай') {
      console.log(`[API] Использование тестовых данных для Китая`);
      return generateMockCarsForChina(15);
    }
    
    // Для других стран возвращаем пустой массив
    return [];
  }
};

/**
 * Генерация мок-данных о автомобилях для Китая
 * Это служебная функция для создания тестовых данных, когда реальные данные недоступны
 */
export const generateMockCarsForChina = (count: number = 10): Car[] => {
  const chineseBrands = ['Geely', 'BYD', 'Great Wall', 'Chery', 'Haval', 'JAC', 'Lifan', 'Dongfeng', 'Foton', 'Changan'];
  const models = ['Atlas', 'Coolray', 'Tugella', 'Tang', 'Han', 'Hovel H6', 'Jolion', 'Tiggo 7 Pro', 'Tiggo 8', 'Arrizo 5'];
  const years = [2020, 2021, 2022, 2023, 2024];
  const bodyTypes = ['SUV', 'Седан', 'Кроссовер', 'Хэтчбек'];
  
  const mockCars: Car[] = [];
  
  for (let i = 0; i < count; i++) {
    const brand = chineseBrands[Math.floor(Math.random() * chineseBrands.length)];
    const model = models[Math.floor(Math.random() * models.length)];
    const year = years[Math.floor(Math.random() * years.length)];
    const basePrice = Math.floor(Math.random() * 2000000) + 800000;
    const bodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
    
    // Create a simple mock car object
    mockCars.push({
      id: `china-${brand}-${model}-${i}`,
      brand,
      model,
      year,
      bodyType,
      colors: ['Белый', 'Черный', 'Серебристый'],
      price: {
        base: basePrice,
        discount: Math.random() > 0.7 ? Math.floor(basePrice * 0.1) : undefined
      },
      engine: {
        type: '4-цилиндровый',
        displacement: 1.5 + Math.floor(Math.random() * 10) / 10,
        power: 120 + Math.floor(Math.random() * 100),
        torque: 200 + Math.floor(Math.random() * 150),
        fuelType: Math.random() > 0.3 ? 'Бензин' : 'Дизель'
      },
      transmission: {
        type: Math.random() > 0.5 ? 'Автоматическая' : 'Механическая',
        gears: 5 + Math.floor(Math.random() * 3)
      },
      drivetrain: Math.random() > 0.6 ? 'Передний' : 'Полный',
      dimensions: {
        length: 4500 + Math.floor(Math.random() * 500),
        width: 1800 + Math.floor(Math.random() * 200),
        height: 1600 + Math.floor(Math.random() * 200),
        wheelbase: 2600 + Math.floor(Math.random() * 200),
        weight: 1500 + Math.floor(Math.random() * 500),
        trunkVolume: 400 + Math.floor(Math.random() * 200)
      },
      performance: {
        acceleration: 8 + Math.random() * 4,
        topSpeed: 180 + Math.floor(Math.random() * 50),
        fuelConsumption: {
          city: 8 + Math.random() * 3,
          highway: 6 + Math.random() * 2,
          combined: 7 + Math.random() * 2
        }
      },
      features: [
        {
          id: `feature-${i}-1`,
          name: 'Климат-контроль',
          category: 'Комфорт',
          isStandard: true
        },
        {
          id: `feature-${i}-2`,
          name: 'Парктроник',
          category: 'Безопасность',
          isStandard: Math.random() > 0.5
        }
      ],
      images: [
        {
          id: `image-${i}-1`,
          url: '/placeholder.svg',
          alt: `${brand} ${model}`
        }
      ],
      description: `${brand} ${model} - современный китайский автомобиль ${bodyType.toLowerCase()} с экономичным расходом топлива и богатой комплектацией.`,
      isNew: Math.random() > 0.7,
      country: 'Китай',
      viewCount: Math.floor(Math.random() * 100)
    });
  }
  
  return mockCars;
};
