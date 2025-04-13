
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Car } from '@/types/car';
import { useCars } from '@/hooks/useCars';
import { saveCar as saveCarAPI, updateCar as updateCarAPI } from '@/services/api/car/carCRUD';

export const useCarSave = () => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { reloadCars } = useCars();
  
  const saveCar = async (car: Car, isNewCar: boolean): Promise<{success: boolean; message?: string}> => {
    setSaving(true);
    console.log("Saving car:", isNewCar ? "new car" : "update car", car);
    console.log("Images to save:", car.images?.length || 0, "images");
    
    try {
      // Ensure basic validation is done
      if (!car.brand || !car.model) {
        toast({
          variant: "destructive",
          title: "Ошибка валидации",
          description: "Пожалуйста, заполните обязательные поля (Марка и Модель)",
        });
        return { success: false, message: "Пожалуйста, заполните обязательные поля" };
      }
      
      // Ensure images are properly formatted before save
      if (car.images && car.images.length > 0) {
        // Make sure the main image URL is in sync with the first image
        car.image_url = car.images[0].url;
        
        // Clean up file properties on images before saving to database
        car.images = car.images.map(img => ({
          id: img.id,
          url: img.url,
          alt: img.alt || `${car.brand} ${car.model}`
        }));
        
        console.log("Prepared images for saving:", car.images.length, "images", car.images);
      } else {
        console.warn("No images to save for this car");
        // Initialize with empty array if no images
        car.images = [];
      }
      
      try {
        if (isNewCar) {
          console.log("Adding new car:", car);
          await saveCarAPI(car);
          
          console.log("Successfully added new car");
          await reloadCars(); // Reload cars to refresh the list
          toast({
            title: "Автомобиль добавлен",
            description: `${car.brand} ${car.model} успешно добавлен`,
          });
          return { success: true };
        } else {
          console.log("Updating existing car:", car);
          await updateCarAPI(car);
          
          console.log("Successfully updated car");
          await reloadCars(); // Reload cars to refresh the list
          toast({
            title: "Автомобиль обновлен",
            description: `${car.brand} ${car.model} успешно обновлен`,
          });
          return { success: true };
        }
      } catch (error) {
        console.error("Error with API call:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error saving car:", error);
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: `Не удалось сохранить автомобиль: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      });
      return { success: false, message: error instanceof Error ? error.message : "Неизвестная ошибка" };
    } finally {
      setSaving(false);
    }
  };
  
  return {
    saving,
    saveCar,
  };
};
