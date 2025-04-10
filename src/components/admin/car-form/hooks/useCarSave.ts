
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCars } from '@/hooks/useCars';
import { Car } from '@/types/car';

export const useCarSave = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    updateCar, 
    addCar, 
    uploadCarImage,
    reloadCars
  } = useCars();
  
  const [saving, setSaving] = useState(false);

  // Save car with updated logic to ensure data is properly saved
  const saveCar = async (car: Car, isNewCar: boolean, imageFile?: File) => {
    if (!car) return;
    
    setSaving(true);
    
    try {
      // Handle image file if provided
      if (imageFile) {
        try {
          const imageUrl = await uploadCarImage(imageFile);
          
          // Update car with new image
          if (car.images && car.images.length > 0) {
            car.images[0].url = imageUrl;
          } else {
            car.images = [
              {
                id: uuidv4(),
                url: imageUrl,
                alt: `${car.brand} ${car.model}`,
              }
            ];
          }
          car.image_url = imageUrl;
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({
            variant: "destructive",
            title: "Ошибка загрузки изображения",
            description: "Не удалось загрузить изображение. Пожалуйста, попробуйте снова.",
          });
          // Continue with saving even if image upload fails
        }
      }
      
      if (isNewCar) {
        await addCar(car);
        toast({
          title: "Автомобиль добавлен",
          description: "Новый автомобиль успешно добавлен в базу данных",
        });
      } else {
        await updateCar(car);
        toast({
          title: "Автомобиль обновлен",
          description: "Информация об автомобиле успешно обновлена в базе данных",
        });
      }
      
      // Force reload data after saving
      await reloadCars();
      
      // Redirect user to car list
      navigate("/admin/cars");
      return true;
    } catch (error) {
      console.error("Error saving car:", error);
      const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: errorMessage,
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    saveCar
  };
};
