
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Car, CarImage } from '@/types/car';
import { v4 as uuidv4 } from 'uuid';

export const useImagePreview = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle image URL change
  const handleImageUrlChange = (url: string) => {
    try {
      // Validate URL
      new URL(url);
      setImagePreview(url);
      return url;
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
  const addImage = (url: string) => {
    try {
      // Validate URL
      new URL(url);
      
      const newImage = {
        id: uuidv4(),
        url: url,
        alt: `Изображение`
      };
      
      toast({
        title: "Изображение добавлено",
        description: "Новое изображение добавлено в галерею"
      });
      
      return newImage;
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
  const removeImage = (index: number, images: CarImage[]) => {
    const updatedImages = [...images];
    if (index >= 0 && index < updatedImages.length) {
      updatedImages.splice(index, 1);
    }
    
    toast({
      title: "Изображение удалено",
      description: "Изображение удалено из галереи"
    });
    
    return updatedImages;
  };

  return {
    imagePreview,
    setImagePreview,
    handleImageUrlChange,
    addImage,
    removeImage
  };
};
