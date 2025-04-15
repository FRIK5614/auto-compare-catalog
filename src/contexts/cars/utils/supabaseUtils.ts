
import { supabase } from "@/integrations/supabase/client";
import { favoriteProvider } from "@/services/database/providers/supabase/favoriteProvider";

// Supabase favorites synchronization functions
export const loadFavoritesFromSupabase = async (): Promise<string[]> => {
  try {
    const favorites = await favoriteProvider.getFavorites();
    console.log('[Supabase] Loaded favorites:', favorites);
    return favorites;
  } catch (error) {
    console.error('Error loading favorites from Supabase:', error);
    return [];
  }
};

export const saveFavoritesToSupabase = async (favorites: string[]): Promise<boolean> => {
  try {
    const result = await favoriteProvider.saveFavorites(favorites);
    console.log('[Supabase] Saved favorites:', favorites);
    return result;
  } catch (error) {
    console.error('Error saving favorites to Supabase:', error);
    return false;
  }
};
