
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { addToFavorites as addToFavoritesAction, removeFromFavorites as removeFromFavoritesAction } from "../favoriteActions";
import { loadFavoritesFromLocalStorage, saveFavoritesToLocalStorage } from "../utils";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  // Initialize favorites from localStorage
  useEffect(() => {
    const favoritesData = loadFavoritesFromLocalStorage();
    if (favoritesData.length > 0 && favorites.length === 0) {
      setFavorites(favoritesData);
    }
  }, [favorites.length]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (favorites.length > 0) {
      saveFavoritesToLocalStorage(favorites);
    }
  }, [favorites]);

  // Handle adding to favorites
  const handleAddToFavorites = async (carId: string) => {
    try {
      const result = await addToFavoritesAction(
        carId, 
        favorites, 
        (newFavorites) => setFavorites(newFavorites),
        (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
      );
      
      if (result) {
        toast(result);
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast({ 
        variant: "destructive", 
        title: "Ошибка", 
        description: "Не удалось добавить в избранное" 
      });
    }
  };

  // Handle removing from favorites
  const handleRemoveFromFavorites = async (carId: string) => {
    try {
      const result = await removeFromFavoritesAction(
        carId, 
        favorites, 
        (newFavorites) => setFavorites(newFavorites),
        (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
      );
      
      if (result) {
        toast(result);
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast({ 
        variant: "destructive", 
        title: "Ошибка", 
        description: "Не удалось удалить из избранного" 
      });
    }
  };

  return {
    favorites,
    setFavorites,
    addToFavorites: handleAddToFavorites,
    removeFromFavorites: handleRemoveFromFavorites
  };
};
