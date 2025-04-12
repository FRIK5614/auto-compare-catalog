
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { saveFavoritesToLocalStorage } from "../../utils";
import { FavoritesActions } from "./types";

export const useFavoritesActions = (
  favorites: string[],
  setFavorites: (favorites: string[]) => void,
  isOnline: boolean,
  setLoading: (loading: boolean) => void,
  loadFromDatabase: () => Promise<string[] | null>,
  syncWithDatabase: (items?: string[]) => Promise<void>,
  loadFromLocalStorage: () => string[]
): FavoritesActions => {
  const { toast } = useToast();

  // Add to favorites
  const addToFavorites = useCallback(async (carId: string) => {
    try {
      // Always update local state and localStorage
      const newFavorites = [...favorites, carId];
      setFavorites(newFavorites);
      saveFavoritesToLocalStorage(newFavorites);
      
      // Show notification
      toast({
        title: "Добавлено в избранное",
        description: isOnline 
          ? "Автомобиль добавлен в список избранного" 
          : "Автомобиль добавлен в избранное локально. Синхронизация будет выполнена при подключении к интернету"
      });
      
      // Sync with database if online
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
  }, [favorites, isOnline, setFavorites, toast]);

  // Remove from favorites
  const removeFromFavorites = useCallback(async (carId: string) => {
    try {
      // Always update local state and localStorage
      const newFavorites = favorites.filter(id => id !== carId);
      setFavorites(newFavorites);
      saveFavoritesToLocalStorage(newFavorites);
      
      // Show notification
      toast({
        title: "Удалено из избранного",
        description: isOnline 
          ? "Автомобиль удален из списка избранного" 
          : "Автомобиль удален из избранного локально. Синхронизация будет выполнена при подключении к интернету"
      });
      
      // Sync with database if online
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
  }, [favorites, isOnline, setFavorites, toast]);

  // Refresh favorites
  const refreshFavorites = useCallback(() => {
    const loadFavoritesFromDB = async () => {
      setLoading(true);
      
      try {
        if (isOnline) {
          // Try to get from database first
          const favoriteIds = await loadFromDatabase();
          
          if (favoriteIds && favoriteIds.length > 0) {
            // Update local state and localStorage
            setFavorites(favoriteIds);
            saveFavoritesToLocalStorage(favoriteIds);
            console.log(`Loaded ${favoriteIds.length} favorites from database`);
          } else {
            // If nothing in DB, use localStorage
            const localFavorites = loadFromLocalStorage();
            if (localFavorites.length > 0) {
              setFavorites(localFavorites);
              // Sync local data with DB
              syncWithDatabase(localFavorites);
            }
          }
        } else {
          // If offline, load from localStorage only
          const localFavorites = loadFromLocalStorage();
          setFavorites(localFavorites);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
        // On error use localStorage
        const localFavorites = loadFromLocalStorage();
        setFavorites(localFavorites);
      } finally {
        setLoading(false);
      }
    };
    
    loadFavoritesFromDB();
  }, [isOnline, loadFromDatabase, loadFromLocalStorage, setFavorites, setLoading, syncWithDatabase]);

  return {
    addToFavorites,
    removeFromFavorites,
    refreshFavorites
  };
};
