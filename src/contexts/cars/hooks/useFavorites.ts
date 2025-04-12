
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { addToFavorites as addToFavoritesAction, removeFromFavorites as removeFromFavoritesAction } from "../favoriteActions";
import { loadFavoritesFromLocalStorage, saveFavoritesToLocalStorage } from "../utils";
import { supabase } from "@/integrations/supabase/client";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();
  const loadedRef = useRef(false);

  // Следим за состоянием сети
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncWithDatabase(); // При восстановлении соединения синхронизируем с БД
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      // При отключении от сети показываем уведомление
      toast({
        title: "Офлайн режим",
        description: "Избранное будет сохранено локально и синхронизировано, когда появится подключение к интернету",
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Загружаем избранное из БД при первоначальной загрузке
  useEffect(() => {
    if (!loadedRef.current) {
      loadFavoritesFromDB();
      loadedRef.current = true;
    }
  }, []);

  // Синхронизируем с БД, когда меняется favorites
  useEffect(() => {
    if (favorites.length > 0 && loadedRef.current && isOnline) {
      saveFavoritesToLocalStorage(favorites);
    }
  }, [favorites, isOnline]);

  // Загрузка избранного из БД
  const loadFavoritesFromDB = useCallback(async () => {
    setLoading(true);
    
    try {
      if (isOnline) {
        // Пытаемся получить из базы данных Supabase
        const { data, error } = await supabase
          .from('favorites')
          .select('car_id');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const favoriteIds = data.map(item => item.car_id);
          // Обновляем локальное состояние и localStorage
          setFavorites(favoriteIds);
          saveFavoritesToLocalStorage(favoriteIds);
          console.log(`Loaded ${favoriteIds.length} favorites from database`);
        } else {
          // Если в БД ничего нет, используем локальное хранилище
          const localFavorites = loadFavoritesFromLocalStorage();
          if (localFavorites.length > 0) {
            setFavorites(localFavorites);
            // Синхронизируем локальные данные с БД
            syncWithDatabase(localFavorites);
          }
        }
      } else {
        // Если офлайн, загружаем только из локального хранилища
        const localFavorites = loadFavoritesFromLocalStorage();
        setFavorites(localFavorites);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      // В случае ошибки используем локальное хранилище
      const localFavorites = loadFavoritesFromLocalStorage();
      setFavorites(localFavorites);
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  // Синхронизация с базой данных
  const syncWithDatabase = useCallback(async (items?: string[]) => {
    if (!isOnline) return;
    
    try {
      const favoritesToSync = items || favorites;
      
      // Получаем текущие избранные из базы
      const { data: currentFavorites, error: fetchError } = await supabase
        .from('favorites')
        .select('car_id');
      
      if (fetchError) {
        console.warn("Error fetching current favorites:", fetchError);
        return;
      }
      
      const currentFavoriteIds = currentFavorites?.map(item => item.car_id) || [];
      
      // Определяем, какие элементы нужно добавить
      const itemsToAdd = favoritesToSync.filter(id => !currentFavoriteIds.includes(id))
        .map(car_id => ({
          car_id,
          user_id: 'anonymous'
        }));
      
      // Если есть что добавлять, делаем это
      if (itemsToAdd.length > 0) {
        const { error: insertError } = await supabase
          .from('favorites')
          .insert(itemsToAdd);
          
        if (insertError) {
          console.warn("Error inserting favorites:", insertError);
        } else {
          console.log(`Successfully synced ${itemsToAdd.length} favorites to database`);
        }
      }
      
      // Если в БД есть то, чего нет в локальном хранилище - не удаляем,
      // чтобы избежать потери данных. Вместо этого добавляем в локальное состояние.
      const missingItems = currentFavoriteIds.filter(id => !favoritesToSync.includes(id));
      if (missingItems.length > 0) {
        const updatedFavorites = [...favoritesToSync, ...missingItems];
        setFavorites(updatedFavorites);
        saveFavoritesToLocalStorage(updatedFavorites);
        console.log(`Added ${missingItems.length} items from database to local favorites`);
      }
    } catch (error) {
      console.error("Error syncing with database:", error);
    }
  }, [favorites, isOnline]);

  // Обработка добавления в избранное
  const handleAddToFavorites = async (carId: string) => {
    try {
      // Всегда обновляем локальное состояние и localStorage
      const newFavorites = [...favorites, carId];
      setFavorites(newFavorites);
      saveFavoritesToLocalStorage(newFavorites);
      
      // Показываем уведомление пользователю
      toast({
        title: "Добавлено в избранное",
        description: isOnline 
          ? "Автомобиль добавлен в список избранного" 
          : "Автомобиль добавлен в избранное локально. Синхронизация будет выполнена при подключении к интернету"
      });
      
      // Если онлайн, синхронизируем с БД
      if (isOnline) {
        const { error } = await supabase
          .from('favorites')
          .insert({
            car_id: carId,
            user_id: 'anonymous'
          });
        
        if (error) {
          console.warn("Error adding to favorites in database:", error);
        }
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast({ 
        variant: "destructive", 
        title: "Ошибка", 
        description: "Не удалось добавить в избранное" 
      });
    }
  };

  // Обработка удаления из избранного
  const handleRemoveFromFavorites = async (carId: string) => {
    try {
      // Всегда обновляем локальное состояние и localStorage
      const newFavorites = favorites.filter(id => id !== carId);
      setFavorites(newFavorites);
      saveFavoritesToLocalStorage(newFavorites);
      
      // Показываем уведомление пользователю
      toast({
        title: "Удалено из избранного",
        description: isOnline 
          ? "Автомобиль удален из списка избранного" 
          : "Автомобиль удален из избранного локально. Синхронизация будет выполнена при подключении к интернету"
      });
      
      // Если онлайн, синхронизируем с БД
      if (isOnline) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('car_id', carId)
          .eq('user_id', 'anonymous');
        
        if (error) {
          console.warn("Error removing from favorites in database:", error);
        }
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast({ 
        variant: "destructive", 
        title: "Ошибка", 
        description: "Не удалось удалить из избранного" 
      });
    }
  };

  // Принудительное обновление избранного
  const refreshFavorites = () => {
    loadFavoritesFromDB();
  };

  return {
    favorites,
    setFavorites,
    loading,
    isOnline,
    addToFavorites: handleAddToFavorites,
    removeFromFavorites: handleRemoveFromFavorites,
    refreshFavorites
  };
};
