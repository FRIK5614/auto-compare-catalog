
import { useEffect } from "react";
import { saveFavoritesToLocalStorage, loadFavoritesFromLocalStorage } from "../../utils";

export const useLocalStorage = (
  favorites: string[],
  setFavorites: (favorites: string[]) => void,
  loadedRef: React.MutableRefObject<boolean>
) => {
  // Load favorites from localStorage on initial load
  useEffect(() => {
    if (!loadedRef.current) {
      const localFavorites = loadFavoritesFromLocalStorage();
      if (localFavorites.length > 0) {
        setFavorites(localFavorites);
      }
    }
  }, [setFavorites, loadedRef]);

  // Save to localStorage when favorites change
  useEffect(() => {
    if (favorites.length > 0 && loadedRef.current) {
      saveFavoritesToLocalStorage(favorites);
    }
  }, [favorites, loadedRef]);

  return {
    loadFromLocalStorage: () => {
      const localFavorites = loadFavoritesFromLocalStorage();
      return localFavorites;
    }
  };
};
