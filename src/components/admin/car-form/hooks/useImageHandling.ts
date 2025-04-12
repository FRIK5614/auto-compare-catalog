
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
      
      // If there's an image_url but no images array, initialize the images array
      if (!car.images || car.images.length === 0) {
        const initialImage = {
          id: uuidv4(),
          url: car.image_url,
          alt: `${car.brand} ${car.model}`
        };
        setImages([initialImage]);
      }
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
    setImagePreview(url);
    return updatedCar;
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, car: Car) => {
    if (e.target.files && e.target.files.length > 0) {
      // Handle multiple files
      const files = Array.from(e.target.files);
      
      // Process each file
      files.forEach((file, index) => {
        setImageFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          const preview = reader.result as string;
          
          // Set the first image as the preview and main image
          if (index === 0) {
            setImagePreview(preview);
            
            // Update main image
            if (handleImageUrlChange) {
              handleImageUrlChange(preview);
            }
          } else {
            // Add additional images
            if (addImage) {
              addImage(preview, car);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle adding a new image
  const addImage = (url: string, car: Car) => {
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
      setImagePreview(url);
    }
    
    return updatedCar;
  };

  // Handle removing an image
  const removeImage = (index: number, car: Car) => {
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
      setImagePreview(updatedImages.length > 0 ? updatedImages[0].url : null);
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
    handleAddImage: addImage,
    handleRemoveImage: removeImage
  };
};
