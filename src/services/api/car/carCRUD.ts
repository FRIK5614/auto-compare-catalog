
import { Car } from '@/types/car';
import { supabase } from '@/integrations/supabase/client';
import { transformVehicleFromSupabase, transformVehicleForSupabase } from '../transformers';

/**
 * Сохранение нового автомобиля в Supabase
 */
export const saveCar = async (car: Car): Promise<Car> => {
  try {
    console.log(`[API] Сохранение автомобиля в Supabase:`, car);
    
    const vehicle = transformVehicleForSupabase(car);
    
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicle)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    console.log(`[API] Автомобиль успешно сохранен в Supabase`);
    return transformVehicleFromSupabase(data);
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
    
    const vehicle = transformVehicleForSupabase(car);
    
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
    return transformVehicleFromSupabase(data);
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
