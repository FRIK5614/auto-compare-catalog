
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

export const useCarsCRUD = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const { toast } = useToast();

  // View a car (increment view count)
  const viewCar = (carId: string) => {
    viewCarAction(carId, cars, (updatedCars) => setCars(updatedCars));
  };

  // Delete a car
  const handleDeleteCar = async (carId: string) => {
    const result = await deleteCarAction(
      carId, 
      cars, 
      (updatedCars) => setCars(updatedCars),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
  };

  // Update a car
  const handleUpdateCar = async (updatedCar: Car) => {
    const result = await updateCarAction(
      updatedCar, 
      cars, 
      (updatedCars) => setCars(updatedCars),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
  };

  // Add a new car
  const handleAddCar = async (newCar: Car) => {
    const result = await addCarAction(
      newCar, 
      cars, 
      (updatedCars) => setCars(updatedCars),
      (message) => toast({ variant: "destructive", title: "Ошибка", description: message })
    );
    
    if (result) {
      toast(result);
    }
  };

  // Upload a car image
  const handleUploadCarImage = async (file: File): Promise<string> => {
    try {
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
  const handleImportCarsData = async (data: string) => {
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

  // Export cars data
  const exportCarsData = (): string => {
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
