
// Types related to favorites functionality
export type FavoritesState = {
  favorites: string[];
  loading: boolean;
  isOnline: boolean;
};

export type FavoritesActions = {
  setFavorites: (favorites: string[]) => void;
  addToFavorites: (carId: string) => Promise<void>;
  removeFromFavorites: (carId: string) => Promise<void>;
  refreshFavorites: () => void;
};

export type UseFavoritesReturn = FavoritesState & FavoritesActions;
