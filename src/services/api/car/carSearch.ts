
import { Car } from '@/types/car';
import { supabase } from '@/integrations/supabase/client';
import { transformVehicleFromSupabase } from '../transformers';

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
    const cars: Car[] = data.map(vehicle => transformVehicleFromSupabase(vehicle));
    
    console.log(`[API] Найдено ${cars.length} автомобилей в Supabase`);
    return cars;
  } catch (error) {
    console.error("Ошибка при поиске автомобилей:", error);
    throw new Error("Не удалось выполнить поиск автомобилей в базе данных");
  }
};
