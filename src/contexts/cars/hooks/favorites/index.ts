
import { useEffect, useRef } from "react";
import { useFavoritesState } from "./useFavoritesState";
import { useFavoritesActions } from "./useFavoritesActions";
import { useLocalStorage } from "./useLocalStorage";
import { useSupabaseSync } from "./useSupabaseSync";
import { UseFavoritesReturn } from "./types";

export const useFavorites = (): UseFavoritesReturn => {
  // Get state
  const state = useFavoritesState();
  
  // Create a ref to track if data has been loaded from localStorage
  const loadedRef = useRef(false);
  
  // Sync with localStorage
  useLocalStorage(state.favorites, state.setFavorites, loadedRef);
  
  // Sync with Supabase (passing state and isOnline)
  useSupabaseSync(state.favorites, state.setFavorites, state.isOnline);
  
  // Get actions
  const actions = useFavoritesActions(state);

  // Mark as loaded after initial render
  useEffect(() => {
    loadedRef.current = true;
  }, []);
  
  // Combine state and actions
  return {
    ...state,
    ...actions
  };
};
