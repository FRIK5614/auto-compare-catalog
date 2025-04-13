
import { Car, Order } from "@/types/car";
import { supabase } from "@/integrations/supabase/client";

// Function to format vehicle data for Supabase
export const formatVehicleForSupabase = (car: Car) => {
  return {
    id: car.id,
    brand: car.brand,
    model: car.model,
    year: car.year,
    body_type: car.bodyType,
    colors: car.colors,
    price: car.price.base,
    price_discount: car.price.discount,
    engine_type: car.engine.type,
    engine_capacity: car.engine.displacement,
    engine_power: car.engine.power,
    engine_torque: car.engine.torque,
    engine_fuel_type: car.engine.fuelType,
    transmission_type: car.transmission.type,
    transmission_gears: car.transmission.gears,
    drivetrain: car.drivetrain,
    dimensions: JSON.stringify(car.dimensions),
    performance: JSON.stringify(car.performance),
    features: JSON.stringify(car.features),
    image_url: car.images && car.images.length > 0 ? car.images[0].url : null,
    description: car.description,
    is_new: car.isNew,
    country: car.country,
    view_count: car.viewCount || 0
  };
};

// Database-only functions - local storage is completely removed
export const loadFavoritesFromSupabase = async (): Promise<string[]> => {
  try {
    console.log('[API] Loading favorites from database');
    
    const { data, error } = await supabase
      .from('favorites')
      .select('car_id');
    
    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('[API] No favorites found in database');
      return [];
    }
    
    const favorites = data.map(item => item.car_id);
    console.log(`[API] Loaded ${favorites.length} favorites from database`);
    
    return favorites;
  } catch (error) {
    console.error("Error loading favorites from database:", error);
    return [];
  }
};

export const saveFavoritesToSupabase = async (favorites: string[]): Promise<boolean> => {
  try {
    console.log(`[API] Saving ${favorites.length} favorites to database`);
    
    // Clear existing favorites
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', 'anonymous');
    
    if (deleteError) {
      console.error('Error clearing favorites:', deleteError);
      return false;
    }
    
    // Insert new favorites
    if (favorites.length > 0) {
      const favoritesToInsert = favorites.map(car_id => ({
        car_id,
        user_id: 'anonymous'
      }));
      
      const { error: insertError } = await supabase
        .from('favorites')
        .insert(favoritesToInsert);
      
      if (insertError) {
        console.error('Error inserting favorites:', insertError);
        return false;
      }
    }
    
    console.log(`[API] Successfully saved favorites to database`);
    return true;
  } catch (error) {
    console.error("Error saving favorites to database:", error);
    return false;
  }
};

export const loadCompareFromSupabase = async (): Promise<string[]> => {
  // Since we don't have a compare table in the database yet,
  // we'll use an empty array for now
  console.log('[API] Loading comparison list from database not implemented yet');
  return [];
};

export const saveCompareToSupabase = async (compareCars: string[]): Promise<boolean> => {
  // Since we don't have a compare table in the database yet
  console.log('[API] Saving comparison list to database not implemented yet');
  return true;
};

// Export compatibility functions with the same names as the old functions
export const loadFavoritesFromLocalStorage = loadFavoritesFromSupabase;
export const saveFavoritesToLocalStorage = saveFavoritesToSupabase;
export const loadCompareFromLocalStorage = loadCompareFromSupabase;
export const saveCompareToLocalStorage = saveCompareToSupabase;
