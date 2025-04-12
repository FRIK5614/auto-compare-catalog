
import { useFavoritesState } from "./useFavoritesState";
import { useFavoritesActions } from "./useFavoritesActions";
import { useLocalStorage } from "./useLocalStorage";
import { useSupabaseSync } from "./useSupabaseSync";
import { UseFavoritesReturn } from "./types";

export const useFavorites = (): UseFavoritesReturn => {
  // Get state
  const state = useFavoritesState();
  
  // Sync with localStorage
  useLocalStorage(state.favorites, state.setFavorites);
  
  // Sync with Supabase
  useSupabaseSync(state);
  
  // Get actions
  const actions = useFavoritesActions(state);
  
  // Combine state and actions
  return {
    ...state,
    ...actions
  };
};
