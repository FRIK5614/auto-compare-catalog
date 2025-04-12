
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Car, CarImage } from '@/types/car';
import { v4 as uuidv4 } from 'uuid';

export const useImagePreview = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle image URL change
  const handleImageUrlChange = (url: string, car: Car) => {
    if (!car) return null;
    
    try {
      // Validate URL
      new URL(url);
      
      const updatedCar = {...car};
      updatedCar.image_url = url;
      
      // Also update the first image if it exists
      if (updatedCar.images && updatedCar.images.length > 0) {
        updatedCar.images[0].url = url;
      } else {
        updatedCar.images = [
          {
            id: uuidv4(),
            url: url,
            alt: `${updatedCar.brand} ${updatedCar.model}`,
          }
        ];
      }
      
      setImagePreview(url);
      return updatedCar;
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Некорректный формат URL"
      });
      return null;
    }
  };

  // Handle adding a new image by URL
  const addImage = (url: string, car: Car) => {
    if (!car) return null;
    
    try {
      // Validate URL
      new URL(url);
      
      const newImage = {
        id: uuidv4(),
        url: url,
        alt: `${car.brand} ${car.model} - Изображение ${(car.images?.length || 0) + 1}`,
      };
      
      const updatedImages = [...(car.images || []), newImage];
      
      // Update car object
      const updatedCar = {...car};
      updatedCar.images = updatedImages;
      
      // If this is the first image, also set it as the main image
      if (updatedImages.length === 1 || !updatedCar.image_url) {
        updatedCar.image_url = url;
        setImagePreview(url);
      }
      
      toast({
        title: "Изображение добавлено",
        description: "Новое изображение добавлено в галерею"
      });
      
      return updatedCar;
    } catch (error) {
      console.error("Invalid URL format:", url);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Некорректный формат URL"
      });
      return null;
    }
  };

  // Handle removing an image
  const removeImage = (index: number, car: Car, images: CarImage[]) => {
    if (!car) return null;
    
    const updatedImages = [...(images || [])];
    if (index >= 0 && index < updatedImages.length) {
      updatedImages.splice(index, 1);
    }
    
    // Update car object
    const updatedCar = {...car};
    updatedCar.images = updatedImages;
    
    // If we removed the main image, update the main image URL
    if (index === 0 || updatedImages.length === 0) {
      updatedCar.image_url = updatedImages.length > 0 ? updatedImages[0].url : "";
      setImagePreview(updatedImages.length > 0 ? updatedImages[0].url : null);
    }
    
    toast({
      title: "Изображение удалено",
      description: "Изображение удалено из галереи"
    });
    
    return updatedCar;
  };

  return {
    imagePreview,
    setImagePreview,
    handleImageUrlChange,
    addImage,
    removeImage
  };
};
