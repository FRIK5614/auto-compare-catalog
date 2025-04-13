
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

// These functions below are deprecated and should not be used
// They are kept for backward compatibility but will be removed in future versions
// All data should be stored and retrieved directly from the database

// Legacy function - DO NOT USE - Data should be fetched from database
export const loadFavoritesFromLocalStorage = (): string[] => {
  console.warn("DEPRECATED: loadFavoritesFromLocalStorage should not be used anymore.");
  return [];
};

// Legacy function - DO NOT USE - Data should be fetched from database
export const loadCompareFromLocalStorage = (): string[] => {
  console.warn("DEPRECATED: loadCompareFromLocalStorage should not be used anymore.");
  return [];
};

// Legacy function - DO NOT USE - Data should be fetched from database
export const loadOrdersFromLocalStorage = (): Order[] => {
  console.warn("DEPRECATED: loadOrdersFromLocalStorage should not be used anymore.");
  return [];
};
