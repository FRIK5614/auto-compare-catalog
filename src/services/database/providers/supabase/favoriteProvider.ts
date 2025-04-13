
import { supabase } from "@/integrations/supabase/client";
import { loadFavoritesFromLocalStorage } from "@/contexts/cars/utils";

export const favoriteProvider = {
  async getFavorites(): Promise<string[]> {
    try {
      console.log('[API] Загрузка избранных автомобилей из Supabase');
      
      // Try to get directly from Supabase
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
      
      // Clear existing favorites
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', 'anonymous');
      
      if (deleteError) {
        console.error('Error clearing favorites:', deleteError);
        return false;
      }
      
      // Insert new favorites
      if (favorites.length > 0) {
        const favoritesToInsert = favorites.map(car_id => ({
          car_id,
          user_id: 'anonymous'
        }));
        
        const { error: insertError } = await supabase
          .from('favorites')
          .insert(favoritesToInsert);
        
        if (insertError) {
          console.error('Error inserting favorites:', insertError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Ошибка при сохранении избранных автомобилей:", error);
      return false;
    }
  }
};
