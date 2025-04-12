
import { Car } from "@/types/car";
import { incrementCarViewCount, saveCar, updateCar as apiUpdateCar, deleteCar as apiDeleteCar } from "@/services/api";
import { transformVehicleForSupabase } from "@/services/api/transformers";
import { supabase } from "@/integrations/supabase/client";

// Increment view count for a car
export const viewCar = async (
  carId: string,
  cars: Car[],
  onSuccess: (updatedCars: Car[]) => void
) => {
  try {
    await incrementCarViewCount(carId);
    
    const updatedCars = cars.map(car => 
      car.id === carId 
        ? { ...car, viewCount: (car.viewCount || 0) + 1 } 
        : car
    );
    
    onSuccess(updatedCars);
  } catch (err) {
    console.error("Failed to update view count:", err);
    
    const updatedCars = cars.map(car => 
      car.id === carId 
        ? { ...car, viewCount: (car.viewCount || 0) + 1 } 
        : car
    );
    
    onSuccess(updatedCars);
  }
};

// Delete a car
export const deleteCar = async (
  carId: string,
  cars: Car[],
  onSuccess: (updatedCars: Car[]) => void,
  onError: (message: string) => void
) => {
  try {
    await apiDeleteCar(carId);
    
    const updatedCars = cars.filter(car => car.id !== carId);
    onSuccess(updatedCars);
    
    return {
      title: "Автомобиль удален",
      description: "Автомобиль был успешно удален из каталога"
    };
  } catch (err) {
    console.error("Failed to delete car:", err);
    
    const updatedCars = cars.filter(car => car.id !== carId);
    onSuccess(updatedCars);
    
    return {
      title: "Автомобиль удален",
      description: "Автомобиль был успешно удален из каталога (локально)"
    };
  }
};

// Update a car
export const updateCar = async (
  updatedCar: Car,
  cars: Car[],
  onSuccess: (updatedCars: Car[]) => void,
  onError: (message: string) => void
) => {
  try {
    await apiUpdateCar(updatedCar);
    
    const updatedCars = cars.map(car => 
      car.id === updatedCar.id ? updatedCar : car
    );
    
    onSuccess(updatedCars);
    
    return {
      title: "Автомобиль обновлен",
      description: "Информация об автомобиле была успешно обновлена"
    };
  } catch (err) {
    console.error("Failed to update car:", err);
    
    const updatedCars = cars.map(car => 
      car.id === updatedCar.id ? updatedCar : car
    );
    
    onSuccess(updatedCars);
    
    return {
      title: "Автомобиль обновлен",
      description: "Информация об автомобиле была успешно обновлена (локально)"
    };
  }
};

// Add a new car
export const addCar = async (
  newCar: Car,
  cars: Car[],
  onSuccess: (updatedCars: Car[]) => void,
  onError: (message: string) => void
) => {
  try {
    const savedCar = await saveCar(newCar);
    
    const updatedCars = [...cars, savedCar];
    onSuccess(updatedCars);
    
    return {
      title: "Автомобиль добавлен",
      description: "Новый автомобиль был успешно добавлен в каталог"
    };
  } catch (err) {
    console.error("Failed to add car:", err);
    
    const updatedCars = [...cars, newCar];
    onSuccess(updatedCars);
    
    return {
      title: "Автомобиль добавлен",
      description: "Новый автомобиль был успешно добавлен в каталог (локально)"
    };
  }
};

// Upload car image
export const uploadCarImage = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('car-images')
      .upload(filePath, file);
    
    if (error) {
      throw error;
    }
    
    const { data: urlData } = supabase.storage
      .from('car-images')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (err) {
    console.error("Failed to upload image:", err);
    throw err;
  }
};

// Import cars data
export const importCarsData = async (
  data: string,
  onSuccess: (parsedData: Car[]) => void,
  onError: (message: string) => void
): Promise<boolean> => {
  try {
    const parsedData = JSON.parse(data);
    if (Array.isArray(parsedData) && parsedData.length > 0) {
      onSuccess(parsedData);
      
      try {
        const { error } = await supabase.from('vehicles').delete().neq('id', 'placeholder');
        if (error) throw error;
        
        for (const car of parsedData) {
          const vehicle = transformVehicleForSupabase(car);
          const { error } = await supabase.from('vehicles').insert(vehicle);
          if (error) console.error("Error inserting vehicle:", error);
        }
      } catch (err) {
        console.error("Failed to save imported data to Supabase:", err);
      }
      
      return true;
    } else {
      onError("Данные не содержат автомобилей или имеют неверный формат");
      return false;
    }
  } catch (error) {
    console.error("Import error:", error);
    onError("Не удалось разобрать JSON данные");
    return false;
  }
};
