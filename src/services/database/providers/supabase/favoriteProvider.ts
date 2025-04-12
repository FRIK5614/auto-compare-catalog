
import { supabase } from "@/integrations/supabase/client";
import { loadFavoritesFromLocalStorage } from "@/contexts/cars/utils";

export const favoriteProvider = {
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
