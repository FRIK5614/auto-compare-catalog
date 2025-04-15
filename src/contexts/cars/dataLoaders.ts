
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
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error loading cars:", error);
      throw error;
    }
    
    console.log(`Loaded ${data?.length || 0} cars from API`);
    
    if (!data || data.length === 0) {
      console.log("No cars found in database");
      return [];
    }
    
    // Transform cars to application format
    const cars = data.map(vehicle => {
      const car = transformVehicleFromSupabase(vehicle);
      console.log(`Transformed car: ${car.brand} ${car.model} (ID: ${car.id})`);
      return car;
    });
    
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
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        vehicles:car_id (
          id,
          brand,
          model,
          image_url
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error loading orders:", error);
      throw error;
    }
    
    console.log(`Loaded ${data?.length || 0} orders from database`);
    
    if (!data || data.length === 0) {
      console.log("No orders found in database");
      return [];
    }
    
    // Transform data to match Order type
    const transformedOrders: Order[] = data.map(order => {
      return {
        id: order.id,
        carId: order.car_id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        message: order.message || '',
        status: (order.status || 'new') as Order['status'],
        createdAt: order.created_at,
        updatedAt: order.updated_at || order.created_at,
        car: order.vehicles ? {
          id: order.vehicles.id,
          brand: order.vehicles.brand,
          model: order.vehicles.model,
          image_url: order.vehicles.image_url
        } : undefined
      };
    });
    
    console.log("Transformed orders:", transformedOrders);
    return transformedOrders;
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
