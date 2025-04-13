
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Car } from '@/types/car';
import { useCars } from '@/hooks/useCars';
import { saveCar, updateCar } from '@/services/api/car/carCRUD';

export const useCarSave = () => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { reloadCars } = useCars();
  
  const saveCar = async (car: Car, isNewCar: boolean): Promise<{ success: boolean, message?: string }> => {
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
        return { success: false, message: "Валидация не пройдена" };
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
      
      let result: Car | null = null;
      
      // Based on whether it's a new car or updating an existing one
      if (isNewCar) {
        console.log("Adding new car:", car);
        try {
          result = await saveCar(car);
        } catch (error) {
          console.error("Error saving new car to API:", error);
        }
        
        if (result) {
          console.log("Successfully added new car", result);
          await reloadCars(); // Reload cars to refresh the list
          toast({
            title: "Автомобиль добавлен",
            description: `${car.brand} ${car.model} успешно добавлен`,
          });
          return { success: true };
        } else {
          throw new Error("Failed to add new car");
        }
      } else {
        console.log("Updating existing car:", car);
        try {
          result = await updateCar(car);
        } catch (error) {
          console.error("Error updating car in API:", error);
        }
        
        if (result) {
          console.log("Successfully updated car", result);
          await reloadCars(); // Reload cars to refresh the list
          toast({
            title: "Автомобиль обновлен",
            description: `${car.brand} ${car.model} успешно обновлен`,
          });
          return { success: true };
        } else {
          throw new Error("Failed to update car");
        }
      }
    } catch (error) {
      console.error("Error saving car:", error);
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: `Не удалось сохранить автомобиль: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      });
      return { success: false, message: error instanceof Error ? error.message : 'Неизвестная ошибка' };
    } finally {
      setSaving(false);
    }
  };
  
  return {
    saving,
    saveCar,
  };
};
