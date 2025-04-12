
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { CarImage } from '@/types/car';
import { useToast } from '@/hooks/use-toast';

export const useImageStorage = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Upload multiple image files to Supabase storage
  const uploadImageFiles = async (carId: string, images: CarImage[] = []): Promise<CarImage[]> => {
    setUploading(true);
    const updatedImages: CarImage[] = [...images];
    let uploadErrors = 0;

    try {
      // Process each image that has a file
      for (let i = 0; i < updatedImages.length; i++) {
        const image = updatedImages[i];
        
        if (image.file) {
          try {
            console.log(`Uploading image ${i + 1} for car ${carId}`);
            
            // Generate a unique filename
            const fileExt = image.file.name.split('.').pop();
            const fileName = `${carId}/${Date.now()}-${uuidv4()}.${fileExt}`;
            
            // Upload to Supabase storage
            const { data, error } = await supabase.storage
              .from('car-images')
              .upload(fileName, image.file);
            
            if (error) {
              throw error;
            }
            
            // Get the public URL
            const { data: urlData } = supabase.storage
              .from('car-images')
              .getPublicUrl(fileName);
            
            // Update the image URL with the public URL
            updatedImages[i] = {
              ...image,
              url: urlData.publicUrl,
              file: undefined // Remove the file reference after upload
            };
            
            console.log(`Successfully uploaded image ${i + 1} to ${urlData.publicUrl}`);
          } catch (err) {
            console.error(`Error uploading image ${i + 1}:`, err);
            uploadErrors++;
          }
        }
      }
      
      if (uploadErrors > 0) {
        toast({
          variant: "destructive",
          title: `${uploadErrors} image(s) failed to upload`,
          description: "Some images could not be uploaded. You may try again later."
        });
      }
      
      return updatedImages;
    } catch (error) {
      console.error("Error in uploadImageFiles:", error);
      toast({
        variant: "destructive",
        title: "Error uploading images",
        description: "There was a problem uploading images to storage."
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
