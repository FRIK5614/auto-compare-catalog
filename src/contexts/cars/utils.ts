
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
    dimensions: car.dimensions,
    performance: car.performance,
    features: JSON.stringify(car.features),
    image_url: car.images && car.images.length > 0 ? car.images[0].url : null,
    description: car.description,
    is_new: car.isNew,
    country: car.country,
    view_count: car.viewCount || 0
  };
};

// Function to save orders to localStorage as backup
export const saveOrdersToLocalStorage = (orders: Order[]) => {
  localStorage.setItem("orders", JSON.stringify(orders));
};

// Function to save favorites to localStorage as backup
export const saveFavoritesToLocalStorage = (favorites: string[]) => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

// Function to save compareCars to localStorage
export const saveCompareToLocalStorage = (compareCars: string[]) => {
  localStorage.setItem("compareCars", JSON.stringify(compareCars));
};

// Function to load favorites from localStorage
export const loadFavoritesFromLocalStorage = (): string[] => {
  const savedFavorites = localStorage.getItem("favorites");
  return savedFavorites ? JSON.parse(savedFavorites) : [];
};

// Function to load compareCars from localStorage
export const loadCompareFromLocalStorage = (): string[] => {
  const savedCompareCars = localStorage.getItem("compareCars");
  return savedCompareCars ? JSON.parse(savedCompareCars) : [];
};

// Function to load orders from localStorage
export const loadOrdersFromLocalStorage = (): Order[] => {
  const savedOrders = localStorage.getItem("orders");
  return savedOrders ? JSON.parse(savedOrders) : [];
};
