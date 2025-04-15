
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

  // Handle multiple image upload with improved logging
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, car: Car) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.log("No files selected for upload");
      return null;
    }
    
    // Handle multiple files
    const files = Array.from(e.target.files);
    console.log("Processing", files.length, "image files for upload");
    
    const newImages = [...images]; // Copy current images
    const uploadPromises: Promise<void>[] = [];
    
    // Process each file with better error handling
    files.forEach((file, index) => {
      console.log(`Processing file ${index + 1}: ${file.name} (${file.size} bytes)`);
      
      const uploadPromise = new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onloadend = () => {
          try {
            const preview = reader.result as string;
            console.log(`File ${index + 1} read successfully, preview length: ${preview.length}`);
            
            // Create a new image object
            const newImage = {
              id: uuidv4(),
              url: preview,
              alt: `${car.brand} ${car.model} - Image ${newImages.length + 1}`,
              file: file // Store file reference for later upload
            };
            
            // Add to images array
            newImages.push(newImage);
            console.log(`Added image ${index + 1} to pending uploads queue`);
            resolve();
          } catch (error) {
            console.error(`Error processing file ${index + 1}:`, error);
            reject(error);
          }
        };
        
        reader.onerror = (error) => {
          console.error(`Error reading file ${index + 1}:`, error);
          reject(error);
        };
        
        reader.readAsDataURL(file);
      });
      
      uploadPromises.push(uploadPromise);
    });
    
    // Wait for all files to be processed
    Promise.all(uploadPromises)
      .then(() => {
        // Update state after all files are processed
        console.log(`All ${files.length} files processed, updating state with ${newImages.length} total images`);
        setImages(newImages);
        
        // Set first image as preview if we don't have one
        if (newImages.length > 0) {
          console.log("Setting image preview to first image");
          setImagePreview(newImages[0].url);
        }
        
        // Update original file for legacy support
        if (files.length > 0) {
          setImageFile(files[0]);
        }
        
        toast({
          title: "Изображения загружены",
          description: `Добавлено ${files.length} изображений для обработки`
        });
      })
      .catch(error => {
        console.error("Error processing image uploads:", error);
        toast({
          variant: "destructive",
          title: "Ошибка загрузки",
          description: "Не удалось обработать некоторые изображения"
        });
      });
    
    return null;
  };

  return {
    imageFile,
    setImageFile,
    handleImageUpload
  };
};
