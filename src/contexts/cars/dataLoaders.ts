
import { Car, Order } from "@/types/car";
import { supabase } from "@/integrations/supabase/client";
import { transformVehicleFromSupabase } from "@/services/api/transformers";
import { orderAPI } from "@/services/api/orderAPI";

// Load cars from API
export const loadCars = async (): Promise<Car[]> => {
  try {
    console.log("Loading cars from API");
    
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('id');
    
    if (error) {
      console.error("Error loading cars:", error);
      throw error;
    }
    
    console.log(`Loaded ${data.length} cars from API`);
    
    // Transform cars to application format
    // Limit to maximum 50 cars for better performance
    const cars = data.slice(0, 50).map(vehicle => transformVehicleFromSupabase(vehicle));
    
    return cars;
  } catch (err) {
    console.error("Failed to load cars:", err);
    throw err;
  }
};

// Load orders from API
export const loadOrders = async (): Promise<Order[]> => {
  try {
    console.log("Loading orders from API");
    
    // Use the orderAPI to fetch orders
    const orders = await orderAPI.getAllOrders();
    
    console.log(`Loaded ${orders.length} orders from API`);
    return orders;
  } catch (err) {
    console.error("Failed to load orders:", err);
    return []; // Return empty array on error to prevent application crash
  }
};

// Load favorites from localStorage
export const loadFavorites = async (): Promise<string[]> => {
  try {
    console.log("Loading favorites from localStorage");
    
    const favorites = localStorage.getItem('favorites');
    if (!favorites) {
      return [];
    }
    
    const parsedFavorites = JSON.parse(favorites) as string[];
    console.log(`Loaded ${parsedFavorites.length} favorites from localStorage`);
    
    return parsedFavorites;
  } catch (err) {
    console.error("Failed to load favorites:", err);
    return [];
  }
};
