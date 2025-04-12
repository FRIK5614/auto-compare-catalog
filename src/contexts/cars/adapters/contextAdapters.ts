
import { Car, CarImage } from "@/types/car";

/**
 * Adapter functions to ensure type compatibility between the internal hooks and the context interface
 */

// Adapter for viewCar to ensure it returns a Car promise
export const createViewCarAdapter = (
  viewCar: (id: string) => Promise<boolean> | boolean,
  cars: Car[]
) => {
  return async (id: string): Promise<Car | undefined> => {
    const result = await viewCar(id);
    return result ? cars.find(car => car.id === id) : undefined;
  };
};

// Adapter for updateCar to ensure it returns a Car promise
export const createUpdateCarAdapter = (
  updateCar: (car: Car) => Promise<boolean> | boolean
) => {
  return async (car: Car): Promise<Car> => {
    const success = await updateCar(car);
    return success ? car : Promise.reject("Failed to update car");
  };
};

// Adapter for addCar to ensure it returns a Car promise
export const createAddCarAdapter = (
  addCar: (car: Car) => Promise<boolean> | boolean
) => {
  return async (car: Partial<Car>): Promise<Car> => {
    const newCar = car as Car; // Type assertion for compatibility
    const success = await addCar(newCar);
    return success ? newCar : Promise.reject("Failed to add car");
  };
};

// Adapter for exportCarsData to ensure it returns a string promise
export const createExportCarsDataAdapter = (
  exportCarsData: () => string
) => {
  return async (): Promise<string> => {
    return Promise.resolve(exportCarsData());
  };
};

// Adapter for importCarsData to ensure it returns a Car[] promise
export const createImportCarsDataAdapter = (
  importCarsData: (data: string) => Promise<boolean>,
  cars: Car[]
) => {
  return async (data: string): Promise<Car[]> => {
    const success = await importCarsData(data);
    return success ? cars : Promise.reject("Failed to import cars");
  };
};

// New adapter for deleteCar to ensure it returns a boolean promise
export const createDeleteCarAdapter = (
  deleteCar: (id: string) => Promise<boolean> | boolean | void
) => {
  return async (id: string): Promise<boolean> => {
    try {
      const result = await deleteCar(id);
      // If the original function returns undefined or void, assume success
      return result !== false;
    } catch (error) {
      console.error("Error deleting car:", error);
      return false;
    }
  };
};

// Adapter for uploadCarImage to ensure it takes a single file parameter and returns a CarImage promise
export const createUploadCarImageAdapter = (
  uploadCarImageAction: (carId: string, file: File) => Promise<string>
) => {
  return async (file: File): Promise<CarImage> => {
    try {
      // We need to provide a dummy carId since the adapter expects only one parameter (file)
      // but the underlying function needs two parameters
      const imageUrl = await uploadCarImageAction('temp', file);
      return {
        id: `img-${Date.now()}`,
        url: imageUrl,
        alt: 'Uploaded image'
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      return Promise.reject("Failed to upload image");
    }
  };
};
