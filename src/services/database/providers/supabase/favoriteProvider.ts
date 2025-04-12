
import { supabase } from "@/integrations/supabase/client";
import { loadFavoritesFromLocalStorage } from "@/contexts/cars/utils";

export const favoriteProvider = {
  async getFavorites(): Promise<string[]> {
    try {
      console.log('[API] Загрузка избранных автомобилей из Supabase');
      
      // Try to get favorites from localStorage first
      const localFavorites = loadFavoritesFromLocalStorage();
      
      if (localFavorites.length > 0) {
        console.log(`[API] Загружено ${localFavorites.length} избранных автомобилей из localStorage`);
        return localFavorites;
      }
      
      // Then try to get from Supabase
      const { data, error } = await supabase
        .from('favorites')
        .select('car_id');
      
      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        console.log('[API] Нет избранных автомобилей');
        return [];
      }
      
      const favorites = data.map(item => item.car_id);
      console.log(`[API] Загружено ${favorites.length} избранных автомобилей из Supabase`);
      
      return favorites;
    } catch (error) {
      console.error("Ошибка при получении данных об избранных автомобилях:", error);
      return [];
    }
  },
  
  async saveFavorites(favorites: string[]): Promise<boolean> {
    try {
      console.log(`[API] Сохранение ${favorites.length} избранных автомобилей в Supabase`);
      
      // Store in localStorage for offline/anonymous use
      localStorage.setItem('favorites', JSON.stringify(favorites));
      
      return true;
    } catch (error) {
      console.error("Ошибка при сохранении избранных автомобилей:", error);
      return false;
    }
  }
};
