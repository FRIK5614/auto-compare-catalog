
import { Car } from '@/types/car';
import { v4 as uuidv4 } from 'uuid';

export const createCarFromImportData = (importedCar: any): Car => {
  // Create a new car object from the imported data
  const newCar: Car = {
    id: uuidv4(),
    brand: importedCar.brand || "",
    model: importedCar.model || "",
    year: importedCar.year || new Date().getFullYear(),
    bodyType: "",
    colors: [],
    price: {
      base: importedCar.price || 0,
    },
    engine: {
      type: "",
      displacement: 0,
      power: 0,
      torque: 0,
      fuelType: "",
    },
    transmission: {
      type: "",
      gears: 0,
    },
    drivetrain: "",
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      wheelbase: 0,
      weight: 0,
      trunkVolume: 0,
    },
    performance: {
      acceleration: 0,
      topSpeed: 0,
      fuelConsumption: {
        city: 0,
        highway: 0,
        combined: 0,
      },
    },
    features: [],
    images: importedCar.imageUrl 
      ? [{ id: uuidv4(), url: importedCar.imageUrl, alt: `${importedCar.brand} ${importedCar.model}` }] 
      : [],
    description: `Импортировано из каталога: ${importedCar.url || ''}`,
    isNew: true,
    country: importedCar.country || "",
    image_url: importedCar.imageUrl || "",
  };
  
  return newCar;
};
