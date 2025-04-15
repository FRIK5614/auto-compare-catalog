
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { CarImage } from '@/types/car';
import { useToast } from '@/hooks/use-toast';
import { setupCarImagesBucket } from '@/services/storage/setupBucket';

export const useImageStorage = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Upload multiple image files to Supabase storage with improved error handling
  const uploadImageFiles = async (carId: string, images: CarImage[] = []): Promise<CarImage[]> => {
    setUploading(true);
    const updatedImages: CarImage[] = [...images];
    let uploadErrors = 0;

    try {
      console.log(`Starting upload of ${images.length} images for car ${carId}...`);
      
      // Ensure the storage bucket exists
      const bucketExists = await setupCarImagesBucket();
      if (!bucketExists) {
        throw new Error("Failed to setup storage bucket for car images");
      }
      
      // Process each image that has a file
      for (let i = 0; i < updatedImages.length; i++) {
        const image = updatedImages[i];
        
        if (image.file) {
          try {
            console.log(`Uploading image ${i + 1} of ${updatedImages.length} for car ${carId}`);
            
            // Generate a unique filename with carId prefix for better organization
            const fileExt = image.file.name.split('.').pop() || 'jpg';
            const fileName = `${carId}/${Date.now()}-${uuidv4()}.${fileExt}`;
            
            console.log(`File will be stored as: ${fileName}`);
            
            // Upload to Supabase storage
            const { data, error } = await supabase.storage
              .from('car-images')
              .upload(fileName, image.file, {
                cacheControl: '3600',
                upsert: false
              });
            
            if (error) {
              console.error(`Error uploading image ${i + 1}:`, error);
              throw error;
            }
            
            console.log(`Successfully uploaded file to storage path: ${data?.path}`);
            
            // Get the public URL
            const { data: urlData } = supabase.storage
              .from('car-images')
              .getPublicUrl(fileName);
            
            console.log(`Public URL for image ${i + 1}: ${urlData.publicUrl}`);
            
            // Update the image URL with the public URL
            updatedImages[i] = {
              ...image,
              url: urlData.publicUrl,
              file: undefined // Remove the file reference after upload
            };
            
            console.log(`Image ${i + 1} updated with public URL`);
          } catch (err) {
            console.error(`Error uploading image ${i + 1}:`, err);
            uploadErrors++;
          }
        } else {
          console.log(`Image ${i + 1} has no file attached, skipping upload`);
        }
      }
      
      if (uploadErrors > 0) {
        toast({
          variant: "destructive",
          title: `${uploadErrors} изображение не загружено`,
          description: "Некоторые изображения не удалось загрузить. Попробуйте позже."
        });
      } else if (updatedImages.length > 0) {
        toast({
          title: "Все изображения загружены",
          description: `Успешно загружено ${updatedImages.length} изображений`
        });
      }
      
      console.log(`Upload process completed. Successful: ${updatedImages.length - uploadErrors}, Failed: ${uploadErrors}`);
      
      return updatedImages;
    } catch (error) {
      console.error("Error in uploadImageFiles:", error);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки изображений",
        description: "Произошла проблема при загрузке изображений."
      });
      return images; // Return original images on failure
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadImageFiles
  };
};
