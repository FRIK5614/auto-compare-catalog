
import { Car, CarImage, Order } from '@/types/car';
import { v4 as uuidv4 } from 'uuid';
import { Json } from '@/integrations/supabase/types';

// Transform vehicle data from Supabase to app format
export const transformVehicleFromSupabase = (vehicle: any): Car => {
  try {
    // Создаем базовый объект автомобиля
    const car: Car = {
      id: vehicle.id || uuidv4(),
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year || new Date().getFullYear(),
      bodyType: vehicle.body_type || '',
      colors: vehicle.colors || [],
      price: {
        base: vehicle.price || 0,
        withOptions: vehicle.price_with_options || undefined,
        discount: vehicle.price_discount || undefined,
        special: vehicle.price_special || undefined,
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
      // Правильно обрабатываем dimensions из JSON
      dimensions: vehicle.dimensions || {
        length: 0,
        width: 0,
        height: 0,
        wheelbase: 0,
        weight: 0,
        trunkVolume: 0,
      },
      // Правильно обрабатываем performance из JSON
      performance: vehicle.performance || {
        acceleration: 0,
        topSpeed: 0,
        fuelConsumption: {
          city: 0,
          highway: 0,
          combined: 0,
        },
      },
      features: vehicle.features || [],
      images: [],
      description: vehicle.description || '',
      isNew: vehicle.is_new !== undefined ? vehicle.is_new : true,
      isPopular: vehicle.is_popular !== undefined ? vehicle.is_popular : false,
      country: vehicle.country || '',
      viewCount: vehicle.view_count || 0,
      image_url: vehicle.image_url || '',
    };

    // Create a standard image entry if image_url exists
    if (vehicle.image_url) {
      car.images = [{
        id: uuidv4(),
        url: vehicle.image_url,
        alt: `${car.brand} ${car.model}`,
      }];
    }

    return car;
  } catch (error) {
    console.error("Error transforming vehicle data:", error);
    throw error;
  }
};

// Transform app data to Supabase format
export const transformVehicleForSupabase = (car: Car) => {
  try {
    console.log("Преобразование автомобиля для Supabase:", car);
    
    // Преобразуем сложные объекты в JSON для Supabase
    const dimensionsJson = car.dimensions ? JSON.stringify(car.dimensions) : null;
    const performanceJson = car.performance ? JSON.stringify(car.performance) : null;
    const featuresJson = car.features ? JSON.stringify(car.features) : null;
    
    console.log("Размеры JSON:", dimensionsJson);
    console.log("Характеристики JSON:", performanceJson);
    
    return {
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      body_type: car.bodyType,
      colors: car.colors,
      price: car.price.base,
      price_with_options: car.price.withOptions,
      price_discount: car.price.discount,
      price_special: car.price.special,
      engine_type: car.engine.type,
      engine_capacity: car.engine.displacement,
      engine_power: car.engine.power,
      engine_torque: car.engine.torque,
      engine_fuel_type: car.engine.fuelType,
      transmission_type: car.transmission.type,
      transmission_gears: car.transmission.gears,
      drivetrain: car.drivetrain,
      dimensions: dimensionsJson as unknown as Json,
      performance: performanceJson as unknown as Json,
      features: featuresJson as unknown as Json,
      description: car.description,
      is_new: car.isNew,
      is_popular: car.isPopular || false,
      country: car.country,
      view_count: car.viewCount || 0,
      image_url: car.image_url || (car.images && car.images.length > 0 ? car.images[0].url : ''),
      // Note: images are stored separately in the image_url field, not in a JSON column
    };
  } catch (error) {
    console.error("Error transforming car data for Supabase:", error);
    throw error;
  }
};

// Create aliases for backward compatibility
export const transformVehicleToCar = transformVehicleFromSupabase;
export const transformCarToVehicle = transformVehicleForSupabase;

// Transform order data from Supabase
export const transformOrder = (orderData: any): Order => {
  return {
    id: orderData.id,
    carId: orderData.car_id,
    customerName: orderData.customer_name,
    customerPhone: orderData.customer_phone,
    customerEmail: orderData.customer_email,
    message: orderData.message,
    status: orderData.status,
    createdAt: orderData.created_at,
    car: orderData.vehicles ? {
      id: orderData.vehicles.id,
      brand: orderData.vehicles.brand,
      model: orderData.vehicles.model,
      image_url: orderData.vehicles.image_url
    } : undefined
  };
};
