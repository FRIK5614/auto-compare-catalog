
import { Car, Order } from "@/types/car";

export const transformVehicleFromSupabase = (vehicle: any): Car => {
  return {
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    bodyType: vehicle.body_type,
    price: {
      base: vehicle.price,
      discount: vehicle.price_discount,
    },
    engine: {
      type: vehicle.engine_type,
      displacement: vehicle.engine_capacity,
      power: vehicle.engine_power,
      torque: vehicle.engine_torque,
      fuelType: vehicle.engine_fuel_type,
    },
    transmission: {
      type: vehicle.transmission_type,
      gears: vehicle.transmission_gears,
    },
    drivetrain: vehicle.drivetrain,
    dimensions: vehicle.dimensions,
    performance: vehicle.performance,
    features: vehicle.features,
    colors: vehicle.colors,
    isNew: vehicle.is_new,
    country: vehicle.country,
    image_url: vehicle.image_url,
    description: vehicle.description,
    viewCount: vehicle.view_count,
    images: vehicle.images || [],
  };
};

export const transformVehicleForSupabase = (car: Car) => {
  const { isPopular, ...carData } = car as any;
  
  return {
    id: carData.id,
    brand: carData.brand,
    model: carData.model,
    year: carData.year,
    body_type: carData.bodyType,
    price: carData.price.base,
    price_discount: carData.price.discount,
    engine_type: carData.engine.type,
    engine_capacity: carData.engine.displacement,
    engine_power: carData.engine.power,
    engine_torque: carData.engine.torque,
    engine_fuel_type: carData.engine.fuelType,
    transmission_type: carData.transmission.type,
    transmission_gears: carData.transmission.gears,
    drivetrain: carData.drivetrain,
    dimensions: typeof carData.dimensions === 'object' ? carData.dimensions : {},
    performance: typeof carData.performance === 'object' ? carData.performance : {},
    features: carData.features,
    colors: carData.colors,
    color: carData.colors && carData.colors.length > 0 ? carData.colors[0] : null,
    is_new: carData.isNew,
    country: carData.country,
    image_url: carData.image_url,
    description: carData.description,
    view_count: carData.viewCount || 0,
    images: carData.images || []
  };
};

/**
 * Transform order data from Supabase to the Order type
 */
export const transformOrder = (orderData: any): Order => {
  const vehicle = orderData.vehicles || null;
  
  return {
    id: orderData.id,
    carId: orderData.car_id,
    customerName: orderData.customer_name,
    customerEmail: orderData.customer_email,
    customerPhone: orderData.customer_phone,
    status: orderData.status || 'new',
    message: orderData.message || '',
    createdAt: orderData.created_at,
    updatedAt: orderData.updated_at || orderData.created_at, // Ensure updatedAt is always provided
    car: vehicle ? {
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      image_url: vehicle.image_url
    } : undefined
  };
};
