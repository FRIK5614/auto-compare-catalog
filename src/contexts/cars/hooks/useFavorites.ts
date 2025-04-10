
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addToFavorites as addToFavoritesAction, removeFromFavorites as removeFromFavoritesAction } from "../favoriteActions";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  // Handle adding to favorites
  const handleAddToFavorites = async (carId: string) => {
    const result = await addToFavoritesAction(
      carId, 
      favorites, 
      (newFavorites) => setFavorites(newFavorites),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
  };

  // Handle removing from favorites
  const handleRemoveFromFavorites = async (carId: string) => {
    const result = await removeFromFavoritesAction(
      carId, 
      favorites, 
      (newFavorites) => setFavorites(newFavorites),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
  };

  return {
    favorites,
    setFavorites,
    addToFavorites: handleAddToFavorites,
    removeFromFavorites: handleRemoveFromFavorites
  };
};
