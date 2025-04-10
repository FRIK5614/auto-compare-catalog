
import { Car } from '@/types/car';
import { v4 as uuidv4 } from 'uuid';

export const createCarFromImportData = (importedCar: any): Car => {
  // Create a new car object from the imported data
  const newCar: Car = {
    id: uuidv4(),
    brand: importedCar.brand || "",
    model: importedCar.model || "",
    year: importedCar.year || new Date().getFullYear(),
    bodyType: importedCar.bodyType || "",
    colors: importedCar.colors || [],
    price: {
      base: importedCar.price || 0,
    },
    engine: {
      type: importedCar.engineType || "",
      displacement: importedCar.engineDisplacement || 0,
      power: importedCar.enginePower || 0,
      torque: importedCar.engineTorque || 0,
      fuelType: importedCar.fuelType || "",
    },
    transmission: {
      type: importedCar.transmissionType || "",
      gears: importedCar.transmissionGears || 0,
    },
    drivetrain: importedCar.drivetrain || "",
    dimensions: {
      length: importedCar.length || 0,
      width: importedCar.width || 0,
      height: importedCar.height || 0,
      wheelbase: importedCar.wheelbase || 0,
      weight: importedCar.weight || 0,
      trunkVolume: importedCar.trunkVolume || 0,
    },
    performance: {
      acceleration: importedCar.acceleration || 0,
      topSpeed: importedCar.topSpeed || 0,
      fuelConsumption: {
        city: importedCar.fuelCity || 0,
        highway: importedCar.fuelHighway || 0,
        combined: importedCar.fuelCombined || 0,
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
