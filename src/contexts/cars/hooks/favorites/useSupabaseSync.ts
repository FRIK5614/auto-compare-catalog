
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { saveFavoritesToLocalStorage } from "../../utils";

export const useSupabaseSync = (
  favorites: string[],
  setFavorites: (favorites: string[]) => void,
  isOnline: boolean
) => {
  // Load favorites from Supabase database
  const loadFromDatabase = useCallback(async () => {
    if (!isOnline) return null;
    
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
      }
      return null;
    } catch (error) {
      console.error("Error loading favorites from database:", error);
      return null;
    }
  }, [isOnline]);

  // Sync with Supabase database
  const syncWithDatabase = useCallback(async (items?: string[]) => {
    if (!isOnline) return;
    
    try {
      const favoritesToSync = items || favorites;
      
      // Get current favorites from database
      const { data: currentFavorites, error: fetchError } = await supabase
        .from('favorites')
        .select('car_id');
      
      if (fetchError) {
        console.warn("Error fetching current favorites:", fetchError);
        return;
      }
      
      const currentFavoriteIds = currentFavorites?.map(item => item.car_id) || [];
      
      // Determine items to add
      const itemsToAdd = favoritesToSync.filter(id => !currentFavoriteIds.includes(id))
        .map(car_id => ({
          car_id,
          user_id: 'anonymous'
        }));
      
      // Add new items if needed
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
      
      // Handle items that exist in database but not locally
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
  }, [favorites, isOnline, setFavorites]);

  return {
    loadFromDatabase,
    syncWithDatabase
  };
};
