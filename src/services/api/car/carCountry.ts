
import { Car } from '@/types/car';
import { supabase } from '@/integrations/supabase/client';
import { transformVehicleFromSupabase, transformVehicleForSupabase } from '../transformers';
import { generateMockCarsForChina } from '../mockData';

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
        const vehicles = mockCars.map(car => transformVehicleForSupabase(car));
        await supabase.from('vehicles').insert(vehicles);
        
        return mockCars;
      }
      
      return [];
    }
    
    // Преобразуем данные из формата Supabase в формат Car
    const cars: Car[] = data.map(vehicle => transformVehicleFromSupabase(vehicle));
    
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
