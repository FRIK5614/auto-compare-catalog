
import { useState } from "react";
import { Car } from "@/types/car";
import { useCars } from "@/contexts/cars/CarsProvider";
import { useToast } from "@/hooks/use-toast";

export const useCarSave = () => {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { saveCar: saveCarToDb, deleteCar: deleteCarFromDb } = useCars();
  const { toast } = useToast();

  const saveCar = async (car: Car, isNewCar: boolean) => {
    setSaving(true);
    try {
      const result = await saveCarToDb(car);
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: result.message || "Не удалось сохранить автомобиль",
        });
      }
      return result;
    } catch (error) {
      console.error("Error saving car:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при сохранении",
      });
      return { success: false, message: "Произошла ошибка при сохранении" };
    } finally {
      setSaving(false);
    }
  };

  const deleteCar = async (carId: string) => {
    setDeleting(true);
    try {
      const success = await deleteCarFromDb(carId);
      if (!success) {
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
