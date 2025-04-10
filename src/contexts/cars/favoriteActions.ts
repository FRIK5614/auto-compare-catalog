
import { supabase } from "@/integrations/supabase/client";
import { saveFavoritesToLocalStorage } from "./utils";

// Add car to favorites
export const addToFavorites = async (
  carId: string, 
  favorites: string[],
  onSuccess: (newFavorites: string[]) => void,
  onError: (message: string) => void
) => {
  if (!favorites.includes(carId)) {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          car_id: carId,
          user_id: 'anonymous'
        });
      
      if (error) {
        throw error;
      }
      
      const newFavorites = [...favorites, carId];
      onSuccess(newFavorites);
      
      return {
        title: "Добавлено в избранное",
        description: "Автомобиль добавлен в список избранного"
      };
    } catch (err) {
      console.error("Failed to add to favorites:", err);
      
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

// Remove car from favorites
export const removeFromFavorites = async (
  carId: string, 
  favorites: string[],
  onSuccess: (newFavorites: string[]) => void,
  onError: (message: string) => void
) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('car_id', carId)
      .eq('user_id', 'anonymous');
    
    if (error) {
      throw error;
    }
    
    const newFavorites = favorites.filter(id => id !== carId);
    onSuccess(newFavorites);
    
    return {
      title: "Удалено из избранного",
      description: "Автомобиль удален из списка избранного"
    };
  } catch (err) {
    console.error("Failed to remove from favorites:", err);
    
    const newFavorites = favorites.filter(id => id !== carId);
    saveFavoritesToLocalStorage(newFavorites);
    onSuccess(newFavorites);
    
    return {
      title: "Удалено из избранного",
      description: "Автомобиль удален из списка избранного (локально)"
    };
  }
};
