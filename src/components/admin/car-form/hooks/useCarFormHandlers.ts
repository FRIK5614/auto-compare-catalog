
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Car, CarImage } from "@/types/car";
import { useCarSave } from "./useCarSave";

export interface UseCarFormHandlersResult {
  handleSave: (updatedCar: Car) => Promise<void>;
  handleDelete: () => Promise<void>;
  handleCancel: () => void;
  handleImageUploadAdapter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddImageAdapter: (url: string) => void;
  handleRemoveImageAdapter: (index: number) => void;
  formErrors: Record<string, any>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  isSaving: boolean;
  isDeleting: boolean;
}

export const useCarFormHandlers = (
  car: Car | null,
  isNewCar: boolean,
  reloadCars: () => Promise<void>,
  setFormLoading: React.Dispatch<React.SetStateAction<boolean>>,
  images: CarImage[],
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, car?: Car) => void,
  handleAddImage: (url: string) => CarImage,
  handleRemoveImage: (index: number) => CarImage[],
  uploadImageFiles: (carId: string) => Promise<CarImage[]>
): UseCarFormHandlersResult => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveCar, deleteCar, isSaving, isDeleting } = useCarSave();
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  
  const handleImageUploadAdapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (car) {
      handleImageUpload(e, car);
    }
  };

  const handleAddImageAdapter = (url: string) => {
    const newImage = handleAddImage(url);
    console.log("Added new image:", newImage);
  };

  const handleRemoveImageAdapter = (index: number) => {
    handleRemoveImage(index);
  };

  const handleSave = async (updatedCar: Car) => {
    if (!car) return;
    
    setFormLoading(true);
    
    try {
      console.log("Handling save for car:", updatedCar);
      
      // First upload any local images
      if (images.some(img => img.file)) {
        toast({
          title: "Загрузка изображений",
          description: "Идет загрузка изображений на сервер..."
        });
        
        try {
          console.log("Uploading images for car ID:", updatedCar.id);
          const uploadedImages = await uploadImageFiles(updatedCar.id);
          console.log("Uploaded images:", uploadedImages);
          
          // Update car with uploaded images
          updatedCar.images = uploadedImages;
          
          if (uploadedImages.length > 0) {
            updatedCar.image_url = uploadedImages[0].url;
          }
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          toast({
            variant: "destructive",
            title: "Ошибка загрузки изображений",
            description: "Произошла ошибка при загрузке изображений, но данные автомобиля будут сохранены"
          });
        }
      } else {
        // Just assign the images array from state
        updatedCar.images = images;
        
        // Make sure image_url is set to the first image url
        if (images.length > 0) {
          updatedCar.image_url = images[0].url;
        }
      }
      
      console.log("Saving car with images:", updatedCar.images);
      
      const result = await saveCar(updatedCar, isNewCar);
      
      if (result.success) {
        toast({
          title: isNewCar ? "Автомобиль добавлен" : "Автомобиль обновлен",
          description: isNewCar
            ? "Новый автомобиль успешно добавлен в каталог"
            : "Изменения сохранены успешно",
        });
        
        console.log("Reloading cars after successful save");
        await reloadCars();
        
        if (isNewCar) {
          navigate("/admin/cars");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: result.message || "Не удалось сохранить автомобиль",
        });
      }
    } catch (error) {
      console.error("Error saving car:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при сохранении",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!car) return;
    
    try {
      const success = await deleteCar(car.id);
      
      if (success) {
        toast({
          title: "Автомобиль удален",
          description: "Автомобиль успешно удален из каталога",
        });
        
        console.log("Reloading cars after successful delete");
        await reloadCars();
        
        navigate("/admin/cars");
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось удалить автомобиль",
        });
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при удалении",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/cars");
  };

  return {
    handleSave,
    handleDelete,
    handleCancel,
    handleImageUploadAdapter,
    handleAddImageAdapter,
    handleRemoveImageAdapter,
    formErrors,
    setFormErrors,
    isSaving,
    isDeleting
  };
};
