
import { Car } from '@/types/car';
import { supabase } from '@/integrations/supabase/client';
import { transformVehicleFromSupabase } from '../transformers';

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
    const cars: Car[] = data.map(vehicle => transformVehicleFromSupabase(vehicle));
    
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
    const car = transformVehicleFromSupabase(data);
    
    console.log(`[API] Получены данные об автомобиле: ${car.brand} ${car.model}`);
    return car;
  } catch (error) {
    console.error(`Ошибка при получении данных об автомобиле с ID ${id}:`, error);
    throw new Error("Не удалось загрузить данные об автомобиле из базы данных");
  }
};
