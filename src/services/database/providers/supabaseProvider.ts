
import { supabase } from "@/integrations/supabase/client";
import { Car } from "@/types/car";
import { transformVehicleFromSupabase, transformVehicleForSupabase } from "@/services/api/transformers";
import { loadFavoritesFromLocalStorage } from "@/contexts/cars/utils";
import { DatabaseProvider } from "../DatabaseProvider";

// Реализация провайдера для Supabase
export const supabaseProvider: DatabaseProvider = {
  // Автомобили
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
  },

  async getOrders(): Promise<any[]> {
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
  },

  async submitPurchaseRequest(formData: Record<string, any>): Promise<{ success: boolean; message: string }> {
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
  },

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
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
  },

  async getBrands(): Promise<string[]> {
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
        const { carsData } = await import('../../../data/carsData');
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
      const { carsData } = await import('../../../data/carsData');
      const brands = [...new Set(carsData.map(car => car.brand))];
      return brands;
    }
  },

  async getFavorites(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('car_id');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const favoriteIds = data.map(item => item.car_id);
        return favoriteIds;
      } else {
        return loadFavoritesFromLocalStorage();
      }
    } catch (err) {
      console.error("Failed to load favorites from Supabase:", err);
      return loadFavoritesFromLocalStorage();
    }
  },

  async saveFavorites(favorites: string[]): Promise<boolean> {
    try {
      // Этот метод можно реализовать при необходимости
      return true;
    } catch (error) {
      console.error("Ошибка при сохранении избранного:", error);
      return false;
    }
  }
};
