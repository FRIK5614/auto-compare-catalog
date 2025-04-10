
import { useState } from 'react';
import { Car } from '@/types/car';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { saveCar, updateCar, deleteCar } from '@/services/api';

export const useCarSave = () => {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  
  // Save or update car
  const handleSaveCar = async (car: Car, isNew: boolean = true) => {
    setSaving(true);
    
    try {
      // Generate ID for new cars
      const carToSave: Car = isNew 
        ? { ...car, id: car.id || uuidv4() } 
        : car;
      
      // Perform save or update based on isNew flag
      const savedCar = isNew 
        ? await saveCar(carToSave)
        : await updateCar(carToSave);
        
      toast({
        title: isNew ? "Автомобиль добавлен" : "Автомобиль обновлен",
        description: `${savedCar.brand} ${savedCar.model} успешно ${isNew ? 'добавлен' : 'обновлен'}.`,
      });
      
      return { success: true, car: savedCar };
    } catch (error) {
      console.error("Error saving car:", error);
      
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: `Не удалось ${isNew ? 'добавить' : 'обновить'} автомобиль. Пожалуйста, попробуйте снова.`,
      });
      
      return { success: false, error };
    } finally {
      setSaving(false);
    }
  };
  
  // Delete car
  const handleDeleteCar = async (carId: string) => {
    setDeleting(true);
    
    try {
      await deleteCar(carId);
      
      toast({
        title: "Автомобиль удален",
        description: "Автомобиль успешно удален из каталога.",
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting car:", error);
      
      toast({
        variant: "destructive",
        title: "Ошибка удаления",
        description: "Не удалось удалить автомобиль. Пожалуйста, попробуйте снова.",
      });
      
      return { success: false, error };
    } finally {
      setDeleting(false);
    }
  };
  
  return {
    saving,
    deleting,
    saveCar: handleSaveCar,
    deleteCar: handleDeleteCar
  };
};
