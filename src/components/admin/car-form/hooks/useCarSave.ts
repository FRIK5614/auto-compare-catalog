
import { useState } from "react";
import { Car } from "@/types/car";
import { useCars } from "@/contexts/cars/CarsProvider";
import { useToast } from "@/hooks/use-toast";

export const useCarSave = () => {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { updateCar, addCar, deleteCar: deleteCarFromDb } = useCars();
  const { toast } = useToast();

  const saveCar = async (car: Car, isNewCar: boolean) => {
    setSaving(true);
    console.log(`Saving car with ${isNewCar ? 'CREATE' : 'UPDATE'} operation:`, car);
    
    try {
      let result;
      
      if (isNewCar) {
        result = await addCar(car);
        console.log("Result from addCar:", result);
      } else {
        result = await updateCar(car);
        console.log("Result from updateCar:", result);
      }
      
      if (!result) {
        console.error("No result returned from car save operation");
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось сохранить автомобиль - пустой результат операции",
        });
        return { success: false, message: "Не удалось сохранить автомобиль - пустой результат операции" };
      }
      
      if (typeof result === 'object' && !result.success && result.message) {
        console.error("Error from car save operation:", result.message);
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: result.message || "Не удалось сохранить автомобиль",
        });
        return { success: false, message: result.message || "Не удалось сохранить автомобиль" };
      }
      
      return { success: true, car: result };
    } catch (error) {
      console.error("Error saving car:", error);
      const errorMessage = error instanceof Error ? error.message : "Произошла ошибка при сохранении";
      
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: errorMessage,
      });
      
      return { success: false, message: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  const deleteCar = async (carId: string) => {
    setDeleting(true);
    try {
      console.log("Deleting car with ID:", carId);
      const success = await deleteCarFromDb(carId);
      
      if (!success) {
        console.error("Failed to delete car, deleteCarFromDb returned false");
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось удалить автомобиль",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error deleting car:", error);
      
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при удалении",
      });
      
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return { saveCar, deleteCar, isSaving: saving, isDeleting: deleting };
};
