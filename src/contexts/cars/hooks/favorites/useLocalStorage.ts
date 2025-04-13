
import { useEffect, MutableRefObject } from "react";
import { loadFavoritesFromSupabase, saveFavoritesToSupabase } from "../../utils";

export const useFavoritesLocalStorage = (
  favorites: string[],
  setFavorites: (favorites: string[]) => void,
  loadedRef: MutableRefObject<boolean>
) => {
  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Only load from Supabase if not already loaded
        if (!loadedRef.current) {
          const storedFavorites = await loadFavoritesFromSupabase();
          if (storedFavorites && storedFavorites.length > 0) {
            setFavorites(storedFavorites);
          }
        }
      } catch (error) {
        console.error("Error loading favorites from database:", error);
      }
    };

    loadFavorites();
  }, [setFavorites, loadedRef]);

  // Save favorites when they change
  useEffect(() => {
    // Only save if loaded (not during initial load)
    if (loadedRef.current && favorites.length > 0) {
      saveFavoritesToSupabase(favorites);
    }
  }, [favorites, loadedRef]);

  return {
    loadFavoritesFromSupabase,
    saveFavoritesToSupabase
  };
};

// Add this export to fix the import error
export const useLocalStorage = useFavoritesLocalStorage;
