
// Local Storage utilities for favorites, compare cars, and orders

// Favorites storage
export const saveFavoritesToLocalStorage = (favorites: string[]) => {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

export const loadFavoritesFromLocalStorage = (): string[] => {
  try {
    const favorites = localStorage.getItem('favorites');
    if (!favorites) {
      return [];
    }
    return JSON.parse(favorites);
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

// Compare storage
export const saveCompareToLocalStorage = (compareCars: string[]) => {
  try {
    console.log("Saving compare cars to localStorage:", compareCars);
    localStorage.setItem('compareCars', JSON.stringify(compareCars));
  } catch (error) {
    console.error('Error saving compare cars to localStorage:', error);
  }
};

export const loadCompareFromLocalStorage = (): string[] => {
  try {
    const compareCars = localStorage.getItem('compareCars');
    console.log("Raw compareCars from localStorage:", compareCars);
    if (!compareCars) {
      return [];
    }
    const parsed = JSON.parse(compareCars);
    console.log("Parsed compareCars:", parsed);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading compare cars from localStorage:', error);
    return [];
  }
};

// Orders storage
export const saveOrdersToLocalStorage = (orders: any[]) => {
  try {
    localStorage.setItem('pendingOrders', JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving pending orders to localStorage:', error);
  }
};

export const loadOrdersFromLocalStorage = (): any[] => {
  try {
    const orders = localStorage.getItem('pendingOrders');
    if (!orders) {
      return [];
    }
    return JSON.parse(orders);
  } catch (error) {
    console.error('Error loading pending orders from localStorage:', error);
    return [];
  }
};

// Re-export Supabase functions to maintain backward compatibility
export { loadFavoritesFromSupabase, saveFavoritesToSupabase } from './utils/supabaseUtils';
