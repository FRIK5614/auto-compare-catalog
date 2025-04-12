
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Car, CarImage } from '@/types/car';
import { useToast } from '@/hooks/use-toast';

export const useImageUpload = (
  images: CarImage[], 
  setImages: (images: CarImage[]) => void, 
  setImagePreview: (preview: string | null) => void
) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Handle multiple image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, car: Car) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
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
      if (!imageFile || newImages.length === 1) {
        setImagePreview(newImages[0].url);
      }
      
      console.log("Added images from files, new count:", newImages.length);
      
      // Update original file for legacy support
      if (files.length > 0) {
        setImageFile(files[0]);
      }
      
      toast({
        title: "Изображения загружены",
        description: `Добавлено ${files.length} изображений для обработки`
      });
    });
  };

  return {
    imageFile,
    setImageFile,
    handleImageUpload
  };
};
