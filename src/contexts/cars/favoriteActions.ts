
import { supabase } from "@/integrations/supabase/client";
import { saveFavoritesToLocalStorage } from "./utils";

// Добавление автомобиля в избранное
export const addToFavorites = async (
  carId: string, 
  favorites: string[],
  onSuccess: (newFavorites: string[]) => void,
  onError: (message: string) => void
) => {
  if (!favorites.includes(carId)) {
    try {
      // Проверяем подключение к интернету
      if (!navigator.onLine) {
        throw new Error("Нет подключения к интернету");
      }
      
      // Добавляем в Supabase
      const { error } = await supabase
        .from('favorites')
        .insert({
          car_id: carId,
          user_id: 'anonymous'
        });
      
      if (error) {
        throw error;
      }
      
      // Обновляем локальный список и localStorage
      const newFavorites = [...favorites, carId];
      onSuccess(newFavorites);
      saveFavoritesToLocalStorage(newFavorites);
      
      return {
        title: "Добавлено в избранное",
        description: "Автомобиль добавлен в список избранного"
      };
    } catch (err) {
      console.error("Ошибка при добавлении в избранное:", err);
      
      // Даже при ошибке добавляем в локальный список и localStorage
      const newFavorites = [...favorites, carId];
      saveFavoritesToLocalStorage(newFavorites);
      onSuccess(newFavorites);
      
      return {
        title: "Добавлено в избранное",
        description: "Автомобиль добавлен в список избранного (локально)"
      };
    }
  }
  return null;
};

// Удаление автомобиля из избранного
export const removeFromFavorites = async (
  carId: string, 
  favorites: string[],
  onSuccess: (newFavorites: string[]) => void,
  onError: (message: string) => void
) => {
  try {
    // Проверяем подключение к интернету
    if (!navigator.onLine) {
      throw new Error("Нет подключения к интернету");
    }
    
    // Удаляем из Supabase
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('car_id', carId)
      .eq('user_id', 'anonymous');
    
    if (error) {
      throw error;
    }
    
    // Обновляем локальный список и localStorage
    const newFavorites = favorites.filter(id => id !== carId);
    onSuccess(newFavorites);
    saveFavoritesToLocalStorage(newFavorites);
    
    return {
      title: "Удалено из избранного",
      description: "Автомобиль удален из списка избранного"
    };
  } catch (err) {
    console.error("Ошибка при удалении из избранного:", err);
    
    // Даже при ошибке удаляем из локального списка и localStorage
    const newFavorites = favorites.filter(id => id !== carId);
    saveFavoritesToLocalStorage(newFavorites);
    onSuccess(newFavorites);
    
    return {
      title: "Удалено из избранного",
      description: "Автомобиль удален из списка избранного (локально)"
    };
  }
};
