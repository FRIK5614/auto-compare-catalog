
import { supabase } from "@/integrations/supabase/client";
import { saveFavoritesToLocalStorage, loadFavoritesFromLocalStorage } from "@/contexts/cars/utils";

export const favoriteProvider = {
  async getFavorites(): Promise<string[]> {
    try {
      // Сначала пробуем загрузить из Supabase
      const { data, error } = await supabase
        .from('favorites')
        .select('car_id');
      
      if (error) {
        console.warn("Error loading favorites from Supabase:", error);
        throw error;
      }
      
      // Если удалось получить данные из Supabase
      if (data && data.length > 0) {
        const favoriteIds = data.map(item => item.car_id);
        // Синхронизируем с localStorage для доступа офлайн
        saveFavoritesToLocalStorage(favoriteIds);
        return favoriteIds;
      } else {
        // Если в Supabase нет данных, используем локальное хранилище как запасной вариант
        const localFavorites = loadFavoritesFromLocalStorage();
        
        // Если у нас есть локальные избранные, но их нет в базе, попробуем их синхронизировать
        // (только если их длина > 0, чтобы не синхронизировать пустой массив)
        if (localFavorites.length > 0) {
          await this.syncFavoritesToDatabase(localFavorites);
        }
        
        return localFavorites;
      }
    } catch (err) {
      console.error("Failed to load favorites from Supabase:", err);
      // В случае ошибки используем локальное хранилище
      return loadFavoritesFromLocalStorage();
    }
  },

  async saveFavorites(favorites: string[]): Promise<boolean> {
    try {
      // Сохраняем в localStorage для быстрого доступа и офлайн использования
      saveFavoritesToLocalStorage(favorites);
      
      // Также синхронизируем с базой данных
      return await this.syncFavoritesToDatabase(favorites);
    } catch (error) {
      console.error("Error saving favorites:", error);
      return false;
    }
  },
  
  async syncFavoritesToDatabase(favorites: string[]): Promise<boolean> {
    try {
      // Получаем текущие избранные из базы
      const { data: currentFavorites, error: fetchError } = await supabase
        .from('favorites')
        .select('car_id');
      
      if (fetchError) {
        console.warn("Error fetching current favorites:", fetchError);
        throw fetchError;
      }
      
      const currentFavoriteIds = currentFavorites?.map(item => item.car_id) || [];
      
      // Определяем, какие элементы нужно добавить
      const itemsToAdd = favorites.filter(id => !currentFavoriteIds.includes(id))
        .map(car_id => ({
          car_id,
          user_id: 'anonymous' // В будущем здесь можно использовать auth.uid()
        }));
      
      // Определяем, какие элементы нужно удалить
      const itemsToRemove = currentFavoriteIds.filter(id => !favorites.includes(id));
      
      // Выполняем операции в транзакции (насколько это возможно с Supabase)
      if (itemsToAdd.length > 0) {
        const { error: insertError } = await supabase
          .from('favorites')
          .insert(itemsToAdd);
          
        if (insertError) {
          console.warn("Error inserting favorites:", insertError);
        }
      }
      
      if (itemsToRemove.length > 0) {
        for (const id of itemsToRemove) {
          const { error: deleteError } = await supabase
            .from('favorites')
            .delete()
            .eq('car_id', id)
            .eq('user_id', 'anonymous');
            
          if (deleteError) {
            console.warn(`Error removing favorite ${id}:`, deleteError);
          }
        }
      }
      
      console.log(`Favorites synced with database. Added: ${itemsToAdd.length}, Removed: ${itemsToRemove.length}`);
      return true;
    } catch (error) {
      console.error("Error syncing favorites with database:", error);
      return false;
    }
  }
};
