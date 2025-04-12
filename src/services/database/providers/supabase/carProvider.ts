
import { supabase } from "@/integrations/supabase/client";
import { Car } from "@/types/car";
import { transformVehicleFromSupabase, transformVehicleForSupabase } from "@/services/api/transformers";

export const carProvider = {
  async getCars(): Promise<Car[]> {
    try {
      console.log('[API] Загрузка автомобилей из Supabase');
      
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
  },

  async getCarById(id: string): Promise<Car | null> {
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
  },

  async searchCars(searchParams: Record<string, any>): Promise<Car[]> {
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
  },

  async saveCar(car: Car): Promise<Car> {
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
  },

  async updateCar(car: Car): Promise<Car> {
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
  },

  async deleteCar(carId: string): Promise<boolean> {
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
  },

  async incrementCarViewCount(carId: string): Promise<void> {
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
  }
};
