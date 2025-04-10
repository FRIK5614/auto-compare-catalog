
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Car } from '@/types/car';

export const useImageHandling = (initialCar: Car | null) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [images, setImages] = useState<{ id: string, url: string, alt: string }[]>([]);

  // Initialize images from car
  const initializeImagesFromCar = (car: Car) => {
    if (car.images && car.images.length > 0) {
      setImages(car.images);
      setImagePreview(car.images[0].url);
    } else if (car.image_url) {
      setImagePreview(car.image_url);
    }
  };

  // Handle image URL change
  const handleImageUrlChange = (url: string) => {
    if (!initialCar) return;
    
    const updatedCar = {...initialCar};
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
    
    setImages(updatedCar.images);
    return updatedCar;
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, car: Car) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setImagePreview(preview);
        
        // Also update in car object
        handleImageUrlChange(preview);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle adding a new image
  const handleAddImage = (url: string, car: Car) => {
    if (!car) return;
    
    const newImage = {
      id: uuidv4(),
      url: url,
      alt: `${car.brand} ${car.model} - Изображение ${(images.length || 0) + 1}`,
    };
    
    const updatedImages = [...(images || []), newImage];
    setImages(updatedImages);
    
    // Update car object
    const updatedCar = {...car};
    updatedCar.images = updatedImages;
    
    // If this is the first image, also set it as the main image
    if (updatedImages.length === 1 || !updatedCar.image_url) {
      updatedCar.image_url = url;
    }
    
    return updatedCar;
  };

  // Handle removing an image
  const handleRemoveImage = (index: number, car: Car) => {
    if (!car || !images) return;
    
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    
    // Update car object
    const updatedCar = {...car};
    updatedCar.images = updatedImages;
    
    // If we removed the main image, update the main image URL
    if (index === 0 || updatedImages.length === 0) {
      updatedCar.image_url = updatedImages.length > 0 ? updatedImages[0].url : "";
    }
    
    return updatedCar;
  };

  return {
    imageFile,
    imagePreview,
    images,
    setImages,
    initializeImagesFromCar,
    handleImageUrlChange,
    handleImageUpload,
    handleAddImage,
    handleRemoveImage
  };
};
