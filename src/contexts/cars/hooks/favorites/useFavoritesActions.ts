
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FavoritesState, FavoritesActions } from "./types";
import { useToast } from "@/hooks/use-toast";

export const useFavoritesActions = (state: FavoritesState): FavoritesActions => {
  const { favorites, setFavorites, setLoading, isOnline } = state;
  const { toast } = useToast();

  const addToFavorites = useCallback(async (carId: string): Promise<void> => {
    // Skip if already in favorites
    if (favorites.includes(carId)) {
      return;
    }

    // Update local state first
    const newFavorites = [...favorites, carId];
    setFavorites(newFavorites);

    // Show toast notification
    toast({
      title: "Добавлено в избранное",
      description: "Автомобиль добавлен в избранное"
    });

    // If offline, we're done
    if (!isOnline) {
      console.log("Offline - skipping Supabase sync for addToFavorites");
      return;
    }

    // Sync with Supabase
    try {
      setLoading(true);
      
      // Fixed: Add user_id in the object for Supabase
      const { error } = await supabase.from('favorites').insert({ 
        car_id: carId,
        user_id: 'guest'  // Use guest for anonymous users
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось добавить автомобиль в избранное на сервере"
      });
    } finally {
      setLoading(false);
    }
  }, [favorites, setFavorites, setLoading, isOnline, toast]);

  const removeFromFavorites = useCallback(async (carId: string): Promise<void> => {
    // Update local state first
    const newFavorites = favorites.filter(id => id !== carId);
    setFavorites(newFavorites);

    // Show toast notification
    toast({
      title: "Удалено из избранного",
      description: "Автомобиль удален из списка избранного"
    });

    // If offline, we're done
    if (!isOnline) {
      console.log("Offline - skipping Supabase sync for removeFromFavorites");
      return;
    }

    // Sync with Supabase
    try {
      setLoading(true);
      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ car_id: carId, user_id: 'guest' });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить автомобиль из избранного на сервере"
      });
    } finally {
      setLoading(false);
    }
  }, [favorites, setFavorites, setLoading, isOnline, toast]);

  const refreshFavorites = useCallback(() => {
    // Currently this just re-triggers the useSupabaseSync effect
    console.log("Refreshing favorites - this will trigger useSupabaseSync");
  }, []);

  return {
    addToFavorites,
    removeFromFavorites,
    refreshFavorites,
    setFavorites
  };
};
