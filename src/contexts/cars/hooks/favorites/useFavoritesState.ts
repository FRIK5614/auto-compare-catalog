
import { useState, useEffect } from "react";
import { loadFavoritesFromLocalStorage } from "../../utils";
import { FavoritesState } from "./types";

export const useFavoritesState = (): FavoritesState => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    favorites,
    loading,
    isOnline,
    setFavorites,
    setLoading
  };
};
