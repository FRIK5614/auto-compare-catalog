
import { supabase } from "@/integrations/supabase/client";

export const brandProvider = {
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
        const { carsData } = await import('../../../../data/carsData');
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
      const { carsData } = await import('../../../../data/carsData');
      const brands = [...new Set(carsData.map(car => car.brand))];
      return brands;
    }
  }
};
