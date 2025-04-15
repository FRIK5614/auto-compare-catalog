
import { Car, Order } from "@/types/car";

export const transformVehicleFromSupabase = (vehicle: any): Car => {
  // Handle case where images might be stored as JSONB in database
  let carImages = vehicle.images || [];
  
  // Ensure images is an array
  if (typeof carImages === 'string') {
    try {
      carImages = JSON.parse(carImages);
    } catch (e) {
      console.error("Failed to parse images string:", e);
      carImages = [];
    }
  }
  
  // Make sure carImages isn't null
  if (!carImages) carImages = [];
  
  // Generate a proper car object
  return {
    id: vehicle.id,
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    bodyType: vehicle.body_type || '',
    price: {
      base: vehicle.price || 0,
      discount: vehicle.price_discount || 0,
    },
    engine: {
      type: vehicle.engine_type || '',
      displacement: vehicle.engine_capacity || 0,
      power: vehicle.engine_power || 0,
      torque: vehicle.engine_torque || 0,
      fuelType: vehicle.engine_fuel_type || '',
    },
    transmission: {
      type: vehicle.transmission_type || '',
      gears: vehicle.transmission_gears || 0,
    },
    drivetrain: vehicle.drivetrain || '',
    dimensions: vehicle.dimensions || {},
    performance: vehicle.performance || {},
    features: vehicle.features || [],
    colors: vehicle.colors || [],
    isNew: vehicle.is_new === undefined ? true : vehicle.is_new,
    country: vehicle.country || '',
    image_url: vehicle.image_url || '',
    description: vehicle.description || '',
    viewCount: vehicle.view_count || 0,
    images: carImages,
  };
};

export const transformVehicleForSupabase = (car: Car) => {
  const { isPopular, ...carData } = car as any;
  
  // Ensure images is properly formatted for the database
  let carImages = carData.images || [];
  
  // Make sure we have a valid image_url from the first image if available
  if (carImages && carImages.length > 0 && carImages[0].url && !carData.image_url) {
    carData.image_url = carImages[0].url;
  }
  
  return {
    id: carData.id,
    brand: carData.brand || '',
    model: carData.model || '',
    year: carData.year || new Date().getFullYear(),
    body_type: carData.bodyType || '',
    price: carData.price?.base || 0,
    price_discount: carData.price?.discount || 0,
    engine_type: carData.engine?.type || '',
    engine_capacity: carData.engine?.displacement || 0,
    engine_power: carData.engine?.power || 0,
    engine_torque: carData.engine?.torque || 0,
    engine_fuel_type: carData.engine?.fuelType || '',
    transmission_type: carData.transmission?.type || '',
    transmission_gears: carData.transmission?.gears || 0,
    drivetrain: carData.drivetrain || '',
    dimensions: typeof carData.dimensions === 'object' ? carData.dimensions : {},
    performance: typeof carData.performance === 'object' ? carData.performance : {},
    features: carData.features || [],
    colors: carData.colors || [],
    color: carData.colors && carData.colors.length > 0 ? carData.colors[0] : null,
    is_new: carData.isNew === undefined ? true : carData.isNew,
    country: carData.country || '',
    image_url: carData.image_url || '',
    description: carData.description || '',
    view_count: carData.viewCount || 0,
    images: carImages
  };
};

/**
 * Transform order data from Supabase to the Order type
 */
export const transformOrder = (orderData: any): Order => {
  if (!orderData) {
    console.warn("Attempted to transform undefined or null orderData");
    return {
      id: '',
      carId: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      status: 'new',
      message: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  const vehicle = orderData.vehicles || null;
  
  return {
    id: orderData.id || '',
    carId: orderData.car_id || '',
    customerName: orderData.customer_name || '',
    customerEmail: orderData.customer_email || '',
    customerPhone: orderData.customer_phone || '',
    status: orderData.status || 'new',
    message: orderData.message || '',
    createdAt: orderData.created_at || new Date().toISOString(),
    updatedAt: orderData.updated_at || orderData.created_at || new Date().toISOString(),
    car: vehicle ? {
      id: vehicle.id || '',
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      image_url: vehicle.image_url || ''
    } : undefined
  };
};
