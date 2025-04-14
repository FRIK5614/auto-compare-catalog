
import { useState, useCallback } from 'react';
import { CarImage, Car } from '@/types/car';
import { v4 as uuidv4 } from 'uuid';
import { useCars } from '@/contexts/cars/CarsProvider';

export const useImageHandling = () => {
  const [images, setImages] = useState<CarImage[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { uploadCarImage } = useCars();
  
  const initializeImagesFromCar = useCallback((car: Car) => {
    if (car.images && car.images.length > 0) {
      setImages(car.images);
      setImagePreview(car.images[0].url);
    } else if (car.image_url) {
      // Legacy support for cars with only image_url
      const newImage: CarImage = {
        id: uuidv4(),
        url: car.image_url,
        alt: `${car.brand} ${car.model}`
      };
      setImages([newImage]);
      setImagePreview(car.image_url);
    }
  }, []);
  
  const handleImageUrlChange = useCallback((url: string) => {
    setImagePreview(url);
  }, []);
  
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>, car?: Car) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    
    // Create a temporary image object with the file attached
    const newImage: CarImage = {
      id: uuidv4(),
      url: localUrl,
      alt: file.name,
      file: file
    };
    
    // If it's the first image, replace all images with this one
    if (images.length === 0) {
      setImages([newImage]);
    } else {
      // Otherwise, update the first image
      const updatedImages = [...images];
      updatedImages[0] = newImage;
      setImages(updatedImages);
    }
  }, [images]);
  
  const handleAddImage = useCallback((url: string): CarImage => {
    const newImage: CarImage = {
      id: uuidv4(),
      url: url,
      alt: 'Car image'
    };
    
    setImages(prev => [...prev, newImage]);
    return newImage;
  }, []);
  
  const handleRemoveImage = useCallback((index: number): CarImage[] => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    
    // If we just removed the displayed image, update the preview
    if (index === 0 && updatedImages.length > 0) {
      setImagePreview(updatedImages[0].url);
    } else if (updatedImages.length === 0) {
      setImagePreview('');
    }
    
    return updatedImages;
  }, [images]);
  
  const uploadImageFiles = useCallback(async (carId: string): Promise<CarImage[]> => {
    // Find images with attached files
    const imagesToUpload = images.filter(img => img.file);
    
    if (imagesToUpload.length === 0) {
      return images;
    }
    
    try {
      // Upload all files and get new URLs
      const uploadPromises = imagesToUpload.map(async (image) => {
        if (!image.file) return image; // Skip if no file
        
        try {
          const url = await uploadCarImage(image.file, carId);
          // Return a new image object with the uploaded URL
          return {
            ...image,
            url,
            file: undefined // Remove the file property once uploaded
          };
        } catch (error) {
          console.error("Error uploading image:", error);
          return image; // Keep original on error
        }
      });
      
      const uploadedImages = await Promise.all(uploadPromises);
      
      // Replace the old images with the uploaded ones
      const updatedImages = images.map((img, index) => {
        const uploadedImage = uploadedImages.find(u => u.id === img.id);
        return uploadedImage || img;
      });
      
      setImages(updatedImages as CarImage[]);
      
      // Update preview if needed
      if (updatedImages.length > 0 && updatedImages[0].url !== imagePreview) {
        setImagePreview(updatedImages[0].url as string);
      }
      
      return updatedImages as CarImage[];
    } catch (error) {
      console.error("Error uploading images:", error);
      return images; // Return original images on error
    }
  }, [images, imagePreview, uploadCarImage]);
  
  return {
    images,
    setImages,
    imagePreview,
    setImagePreview,
    handleImageUrlChange,
    handleImageUpload,
    handleAddImage,
    handleRemoveImage,
    uploadImageFiles,
    initializeImagesFromCar
  };
};
