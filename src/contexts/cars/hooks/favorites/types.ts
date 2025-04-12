
// Types related to favorites functionality
export type FavoritesState = {
  favorites: string[];
  loading: boolean;
  isOnline: boolean;
  setFavorites: (favorites: string[]) => void;
  setLoading: (loading: boolean) => void;
};

export type FavoritesActions = {
  addToFavorites: (carId: string) => Promise<void>;
  removeFromFavorites: (carId: string) => Promise<void>;
  refreshFavorites: () => void;
  setFavorites: (favorites: string[]) => void;
};

export type UseFavoritesReturn = FavoritesState & FavoritesActions;
