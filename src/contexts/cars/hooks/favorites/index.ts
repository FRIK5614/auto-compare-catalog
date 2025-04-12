
import { useCompareState } from "./useFavoritesState";
import { useCompareActions } from "./useFavoritesActions";
import { useLocalStorage } from "./useLocalStorage";
import { useSupabaseSync } from "./useSupabaseSync";
import { UseFavoritesReturn } from "./types";

export const useFavorites = (): UseFavoritesReturn => {
  // Get state
  const state = useCompareState();
  
  // Sync with localStorage
  useLocalStorage(state.favorites);
  
  // Sync with Supabase (passing isOnline as undefined, which is valid according to the signature)
  useSupabaseSync(state);
  
  // Get actions
  const actions = useCompareActions(state);
  
  // Combine state and actions
  return {
    ...state,
    ...actions
  };
};
