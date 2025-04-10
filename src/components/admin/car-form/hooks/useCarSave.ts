
import { useState, useRef } from 'react';
import { Car } from '@/types/car';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { saveCar, updateCar, deleteCar } from '@/services/api';
import { useNavigate } from 'react-router-dom';

export const useCarSave = () => {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const saveInProgressRef = useRef(false);
  const deleteInProgressRef = useRef(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Save or update car
  const handleSaveCar = async (car: Car, isNew: boolean = true) => {
    // Prevent multiple simultaneous save operations
    if (saveInProgressRef.current) {
      toast({
        title: "Сохранение в процессе",
        description: "Пожалуйста, дождитесь завершения текущего сохранения.",
      });
      return { success: false };
    }
    
    saveInProgressRef.current = true;
    setSaving(true);
    console.log(`🚀 Starting ${isNew ? 'save' : 'update'} operation for car:`, car.id);
    
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
      
      console.log(`✅ Successfully ${isNew ? 'saved' : 'updated'} car:`, savedCar.id);
      
      // Navigate to car list after successful save of new car
      if (isNew) {
        setTimeout(() => {
          navigate('/admin/cars');
        }, 1000);
      }
      
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
      // Add a small delay before allowing another save to prevent rapid double clicks
      setTimeout(() => {
        saveInProgressRef.current = false;
      }, 500);
    }
  };
  
  // Delete car
  const handleDeleteCar = async (carId: string) => {
    if (deleteInProgressRef.current) {
      toast({
        title: "Удаление в процессе",
        description: "Пожалуйста, дождитесь завершения текущего удаления.",
      });
      return { success: false };
    }
    
    deleteInProgressRef.current = true;
    setDeleting(true);
    console.log("🚀 Starting delete operation for car:", carId);
    
    try {
      await deleteCar(carId);
      
      toast({
        title: "Автомобиль удален",
        description: "Автомобиль успешно удален из каталога.",
      });
      
      console.log("✅ Successfully deleted car:", carId);
      
      // Navigate to car list after successful deletion
      setTimeout(() => {
        navigate('/admin/cars');
      }, 1000);
      
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
      // Add a small delay before allowing another delete
      setTimeout(() => {
        deleteInProgressRef.current = false;
      }, 500);
    }
  };
  
  return {
    saving,
    deleting,
    saveCar: handleSaveCar,
    deleteCar: handleDeleteCar
  };
};
