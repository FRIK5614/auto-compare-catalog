
import { useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFavoritesState } from "./useFavoritesState";
import { useLocalStorage } from "./useLocalStorage";
import { useSupabaseSync } from "./useSupabaseSync";
import { useFavoritesActions } from "./useFavoritesActions";
import { UseFavoritesReturn } from "./types";

export const useFavorites = (): UseFavoritesReturn => {
  const loadedRef = useRef(false);
  const { toast } = useToast();
  
  // Get favorites state
  const { favorites, loading, isOnline, setFavorites, setLoading } = useFavoritesState();
  
  // Local storage operations
  const { loadFromLocalStorage } = useLocalStorage(favorites, setFavorites, loadedRef);
  
  // Supabase sync operations
  const { loadFromDatabase, syncWithDatabase } = useSupabaseSync(favorites, setFavorites, isOnline);
  
  // Favorites actions
  const { addToFavorites, removeFromFavorites, refreshFavorites } = useFavoritesActions(
    favorites,
    setFavorites,
    isOnline,
    setLoading,
    loadFromDatabase,
    syncWithDatabase,
    loadFromLocalStorage
  );

  // Show offline notification when network status changes
  useEffect(() => {
    const handleOffline = () => {
      toast({
        title: "Офлайн режим",
        description: "Избранное будет сохранено локально и синхронизировано, когда появится подключение к интернету",
      });
    };
    
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Load favorites from DB on initial load
  useEffect(() => {
    if (!loadedRef.current) {
      refreshFavorites();
      loadedRef.current = true;
    }
  }, [refreshFavorites]);

  return {
    favorites,
    loading,
    isOnline,
    setFavorites,
    addToFavorites,
    removeFromFavorites,
    refreshFavorites
  };
};
