
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Car, CarImage } from '@/types/car';
import { useToast } from '@/hooks/use-toast';
import { useImageStorage } from './useImageStorage';

export const useImprovedImageHandling = () => {
  const [images, setImages] = useState<CarImage[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { uploadImageFiles } = useImageStorage();

  // Initialize images from car data
  const initializeImagesFromCar = useCallback((car: Car) => {
    if (car?.images?.length > 0) {
      console.log("Initializing images from car:", car.images.length, "images");
      setImages(car.images);
      
      // Set first image as preview
      if (car.images[0]?.url) {
        setImagePreview(car.images[0].url);
      }
    } else if (car?.image_url) {
      // Handle legacy image_url field
      console.log("Using legacy image_url field:", car.image_url);
      const legacyImage: CarImage = {
        id: uuidv4(),
        url: car.image_url,
        alt: `${car.brand} ${car.model}`
      };
      
      setImages([legacyImage]);
      setImagePreview(car.image_url);
    } else {
      console.log("No images found for car");
      setImages([]);
      setImagePreview(null);
    }
  }, []);

  // Add image from URL
  const handleAddImage = useCallback((url: string, car: Car) => {
    if (!url.trim()) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "URL изображения не может быть пустым"
      });
      return null;
    }
    
    try {
      // Validate URL
      new URL(url);
      
      const newImage: CarImage = {
        id: uuidv4(),
        url: url,
        alt: `${car.brand} ${car.model} - Image ${images.length + 1}`
      };
      
      const updatedImages = [...images, newImage];
      setImages(updatedImages);
      
      // Set as preview if it's the first image
      if (updatedImages.length === 1) {
        setImagePreview(url);
      }
      
      toast({
        title: "Изображение добавлено",
        description: "Изображение по ссылке добавлено успешно"
      });
      
      const updatedCar = {
        ...car,
        images: updatedImages,
        image_url: updatedImages[0]?.url || car.image_url
      };
      
      return updatedCar;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Некорректный URL",
        description: "Пожалуйста, введите действительный URL изображения"
      });
      return null;
    }
  }, [images, toast]);

  // Handle file upload including multiple files
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>, car: Car) => {
    if (!e.target.files || e.target.files.length === 0) return null;
    
    // Handle multiple files
    const files = Array.from(e.target.files);
    console.log("Processing", files.length, "image files");
    
    const newImages = [...images]; // Copy current images
    const uploadPromises: Promise<void>[] = [];
    
    // Process each file
    files.forEach((file) => {
      const uploadPromise = new Promise<void>((resolve) => {
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const preview = reader.result as string;
          
          // Create a new image object
          const newImage = {
            id: uuidv4(),
            url: preview,
            alt: `${car.brand} ${car.model} - Image ${newImages.length + 1}`,
            file: file // Store file reference for later upload
          };
          
          // Add to images array
          newImages.push(newImage);
          resolve();
        };
        
        reader.readAsDataURL(file);
      });
      
      uploadPromises.push(uploadPromise);
    });
    
    // Wait for all files to be processed
    Promise.all(uploadPromises).then(() => {
      // Update state after all files are processed
      setImages(newImages);
      
      // Set first image as preview if we don't have one
      if (newImages.length > 0 && !imagePreview) {
        setImagePreview(newImages[0].url);
      }
      
      toast({
        title: "Изображения загружены",
        description: `Добавлено ${files.length} изображений для обработки`
      });
    });
    
    const updatedCar = {
      ...car,
      images: newImages,
      image_url: newImages[0]?.url || car.image_url
    };
    
    return updatedCar;
  }, [images, imagePreview, toast]);

  // Remove image
  const handleRemoveImage = useCallback((index: number, car: Car) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    
    setImages(updatedImages);
    
    // Update preview if needed
    if (index === 0 || imagePreview === images[index]?.url) {
      setImagePreview(updatedImages[0]?.url || null);
    }
    
    toast({
      title: "Изображение удалено",
      description: "Изображение удалено из галереи"
    });
    
    const updatedCar = {
      ...car,
      images: updatedImages,
      image_url: updatedImages[0]?.url || ''
    };
    
    return updatedCar;
  }, [images, imagePreview, toast]);

  return {
    images,
    setImages,
    imagePreview,
    setImagePreview,
    initializeImagesFromCar,
    handleAddImage,
    handleImageUpload,
    handleRemoveImage,
    uploadImageFiles
  };
};
