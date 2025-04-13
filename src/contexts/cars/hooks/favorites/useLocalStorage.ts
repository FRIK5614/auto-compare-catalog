
import { useEffect } from "react";
import { loadFavoritesFromSupabase, saveFavoritesToSupabase } from "../../utils";

export const useFavoritesLocalStorage = (
  favorites: string[],
  setFavorites: (favorites: string[]) => void
) => {
  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await loadFavoritesFromSupabase();
        if (storedFavorites && storedFavorites.length > 0) {
          setFavorites(storedFavorites);
        }
      } catch (error) {
        console.error("Error loading favorites from database:", error);
      }
    };

    loadFavorites();
  }, [setFavorites]);

  // Save favorites when they change
  useEffect(() => {
    if (favorites.length > 0) {
      saveFavoritesToSupabase(favorites);
    }
  }, [favorites]);

  return {
    loadFavoritesFromSupabase,
    saveFavoritesToSupabase
  };
};
