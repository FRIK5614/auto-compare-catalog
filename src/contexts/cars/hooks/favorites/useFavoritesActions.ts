import { useState, useRef, useCallback } from "react";
import { saveFavoritesToLocalStorage } from "../../utils";
import { FavoritesState, FavoritesActions } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFavoritesActions = (
  state: FavoritesState
): FavoritesActions => {
  const { favorites, setFavorites, loading, setLoading, isOnline } = state;
  const { toast } = useToast();
  const loadedRef = useRef(false);

  // Add car to favorites
  const addToFavorites = useCallback(async (carId: string) => {
    if (favorites.includes(carId)) return;
    
    try {
      setLoading(true);
      
      // Update local state first
      const updatedFavorites = [...favorites, carId];
      setFavorites(updatedFavorites);
      loadedRef.current = true;
      
      // Save to localStorage
      saveFavoritesToLocalStorage(updatedFavorites);
      
      // If online, sync with Supabase
      if (isOnline) {
        try {
          const { error } = await supabase
            .from('favorites')
            .insert([{ car_id: carId }]);
            
          if (error) throw error;
          
        } catch (supabaseError) {
          console.error("Failed to sync favorites to Supabase:", supabaseError);
          toast({
            title: "Синхронизация не удалась",
            description: "Избранное сохранено локально, но не синхронизировано с облаком",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить автомобиль в избранное",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [favorites, isOnline, setFavorites, setLoading, toast]);

  // Remove car from favorites
  const removeFromFavorites = useCallback(async (carId: string) => {
    if (!favorites.includes(carId)) return;
    
    try {
      setLoading(true);
      
      // Update local state first
      const updatedFavorites = favorites.filter(id => id !== carId);
      setFavorites(updatedFavorites);
      loadedRef.current = true;
      
      // Save to localStorage
      saveFavoritesToLocalStorage(updatedFavorites);
      
      // If online, sync with Supabase
      if (isOnline) {
        try {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('car_id', carId);
            
          if (error) throw error;
          
        } catch (supabaseError) {
          console.error("Failed to sync favorites deletion to Supabase:", supabaseError);
          toast({
            title: "Синхронизация не удалась",
            description: "Изменения сохранены локально, но не синхронизированы с облаком",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить автомобиль из избранного",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [favorites, isOnline, setFavorites, setLoading, toast]);

  // Refresh favorites (reload from Supabase)
  const refreshFavorites = useCallback(() => {
    // Implement refresh logic if needed
    console.log("Refreshing favorites");
  }, []);

  return {
    addToFavorites,
    removeFromFavorites,
    refreshFavorites,
    setFavorites
  };
};
