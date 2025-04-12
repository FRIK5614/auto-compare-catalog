
import { Car, CarImage, Order } from '@/types/car';

/**
 * Функция для преобразования объекта из таблицы vehicles в формат Car
 */
export const transformVehicleToCar = (vehicle: any): Car => {
  // Безопасная обработка поля features
  let featuresData = [];
  try {
    // Проверяем тип данных features
    if (typeof vehicle.features === 'string') {
      // Если это строка, пробуем распарсить как JSON
      featuresData = JSON.parse(vehicle.features);
    } else if (Array.isArray(vehicle.features)) {
      // Если это уже массив, используем как есть
      featuresData = vehicle.features;
    } else if (vehicle.features && typeof vehicle.features === 'object') {
      // Если это объект, но не массив, оборачиваем в массив
      featuresData = [vehicle.features];
    }
  } catch (error) {
    console.warn(`Ошибка при парсинге features для автомобиля ${vehicle.id}:`, error);
    featuresData = []; // В случае ошибки используем пустой массив
  }

  // Обработка изображений
  let imagesData: CarImage[] = [];
  try {
    // Пробуем проверить, есть ли у vehicle поле images
    if (vehicle.images) {
      // Если изображения хранятся как строка JSON
      if (typeof vehicle.images === 'string') {
        imagesData = JSON.parse(vehicle.images);
      }
      // Если изображения уже в формате массива
      else if (Array.isArray(vehicle.images)) {
        imagesData = vehicle.images;
      }
    }
  } catch (error) {
    console.warn(`Ошибка при парсинге images для автомобиля ${vehicle.id}:`, error);
  }

  // Если изображений нет или произошла ошибка, используем основное изображение
  if (imagesData.length === 0 && vehicle.image_url) {
    imagesData = [
      {
        id: `img-${vehicle.id}-1`,
        url: vehicle.image_url,
        alt: `${vehicle.brand} ${vehicle.model}`
      }
    ];
  }

  // Создаем базовый объект Car
  const car: Car = {
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    bodyType: vehicle.body_type || 'Не указан',
    colors: Array.isArray(vehicle.colors) ? vehicle.colors : ['Белый'],
    price: {
      base: vehicle.price || 0,
      discount: vehicle.price_discount
    },
    engine: {
      type: vehicle.engine_type || 'Бензиновый',
      displacement: vehicle.engine_capacity || 1.6,
      power: vehicle.engine_power || 100,
      torque: vehicle.engine_torque || 150,
      fuelType: vehicle.engine_fuel_type || 'Бензин'
    },
    transmission: {
      type: vehicle.transmission_type || 'Автоматическая',
      gears: vehicle.transmission_gears || 6
    },
    drivetrain: vehicle.drivetrain || 'Передний',
    dimensions: vehicle.dimensions || {
      length: 4500,
      width: 1800,
      height: 1500,
      wheelbase: 2700,
      weight: 1500,
      trunkVolume: 400
    },
    performance: vehicle.performance || {
      acceleration: 10,
      topSpeed: 180,
      fuelConsumption: {
        city: 10,
        highway: 7,
        combined: 8.5
      }
    },
    features: featuresData,
    images: imagesData,
    description: vehicle.description || `${vehicle.brand} ${vehicle.model} ${vehicle.year} года`,
    isNew: vehicle.is_new !== undefined ? vehicle.is_new : true,
    country: vehicle.country || 'Не указана',
    viewCount: vehicle.view_count || 0,
    image_url: vehicle.image_url || (imagesData.length > 0 ? imagesData[0].url : '/placeholder.svg')
  };
  
  return car;
};

/**
 * Функция для преобразования объекта Car в формат для сохранения в таблице vehicles
 */
export const transformCarToVehicle = (car: Car): any => {
  // Преобразование массива изображений в JSON строку, если он существует
  const imagesJson = car.images && car.images.length > 0 
    ? JSON.stringify(car.images.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt
      }))) 
    : null;

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
    features: car.features,
    image_url: car.image_url || (car.images && car.images.length > 0 ? car.images[0].url : null),
    images: imagesJson, // Сохраняем массив изображений как JSON
    description: car.description,
    is_new: car.isNew,
    country: car.country,
    view_count: car.viewCount || 0
  };
};

/**
 * Transform order data from database to Order type
 */
export const transformOrder = (data: any): Order => {
  return {
    id: data.id,
    carId: data.car_id,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    customerEmail: data.customer_email,
    message: data.message || '',
    status: (data.status || 'new') as 'new' | 'processing' | 'completed' | 'canceled',
    createdAt: data.created_at,
    car: data.vehicles ? {
      id: data.vehicles.id,
      brand: data.vehicles.brand,
      model: data.vehicles.model,
      image_url: data.vehicles.image_url
    } : undefined
  };
};
