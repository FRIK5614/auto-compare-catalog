
import { useState } from "react";
import { Car } from "@/types/car";
import { useToast } from "@/hooks/use-toast";
import { 
  viewCar as viewCarAction, 
  deleteCar as deleteCarAction, 
  updateCar as updateCarAction, 
  addCar as addCarAction, 
  uploadCarImage as uploadCarImageAction, 
  importCarsData as importCarsDataAction 
} from "../carActions";

export const useCarsCRUD = (initialCars: Car[] = []) => {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const { toast } = useToast();

  // View a car (increment view count)
  const viewCar = (carId: string) => {
    viewCarAction(carId, cars, (updatedCars) => setCars(updatedCars));
  };

  // Delete a car
  const handleDeleteCar = async (carId: string): Promise<boolean> => {
    const result = await deleteCarAction(
      carId, 
      cars, 
      (updatedCars) => setCars(updatedCars),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
    return !!result;
  };

  // Update a car
  const handleUpdateCar = async (updatedCar: Car): Promise<boolean> => {
    const result = await updateCarAction(
      updatedCar, 
      cars, 
      (updatedCars) => setCars(updatedCars),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
    return !!result;
  };

  // Add a new car
  const handleAddCar = async (newCar: Car): Promise<boolean> => {
    const result = await addCarAction(
      newCar, 
      cars, 
      (updatedCars) => setCars(updatedCars),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
    return !!result;
  };

  // Upload a car image - Modified to match the required signature
  const handleUploadCarImage = async (carId: string, file: File): Promise<string> => {
    try {
      // We're ignoring carId here since the original implementation doesn't use it
      // but we need to match the signature in the interface
      const url = await uploadCarImageAction(file);
      toast({
        title: "Изображение загружено",
        description: "Изображение успешно загружено на сервер"
      });
      return url;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: "Не удалось загрузить изображение. Попробуйте еще раз."
      });
      throw err;
    }
  };

  // Import cars data
  const handleImportCarsData = async (data: string): Promise<boolean> => {
    return await importCarsDataAction(
      data,
      (parsedData) => {
        setCars(parsedData);
        toast({
          title: "Импорт завершен",
          description: `Импортировано ${parsedData.length} автомобилей`
        });
      },
      (message) => toast({ variant: "destructive", title: "Ошибка импорта", description: message })
    );
  };

  // Export cars data - Ensure it always returns a non-empty string
  const exportCarsData = (): string => {
    if (cars.length === 0) {
      return "[]"; // Return empty array as string if no cars
    }
    return JSON.stringify(cars, null, 2);
  };

  // Get car by ID
  const getCarById = (id: string) => {
    return cars.find(car => car.id === id);
  };

  return {
    cars,
    setCars,
    viewCar,
    deleteCar: handleDeleteCar,
    updateCar: handleUpdateCar,
    addCar: handleAddCar,
    uploadCarImage: handleUploadCarImage,
    importCarsData: handleImportCarsData,
    exportCarsData,
    getCarById
  };
};
