
import { Car } from '@/types/car';
import { supabase } from '@/integrations/supabase/client';
import { transformVehicleToCar, transformCarToVehicle } from './transformers';

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
