import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CarImage } from '@/types/car';
import { v4 as uuidv4 } from 'uuid';

export const useImageStorage = () => {
  const { toast } = useToast();

  // Upload physical files to Supabase Storage
  const uploadImageFiles = async (carId: string, images: CarImage[]) => {
    const uploadResults = [];
    
    // Filter images that have a file property (meaning they are local files)
    const localImages = images.filter(img => img.file);
    
    if (localImages.length === 0) {
      console.log("No local images to upload to storage");
      return images; // Return original images if no local files to upload
    }
    
    console.log(`Uploading ${localImages.length} images to Supabase Storage`);
    toast({
      title: "Загрузка изображений",
      description: `Загрузка ${localImages.length} изображений на сервер...`
    });
    
    // Create storage bucket if it doesn't exist (will be ignored if it exists)
    try {
      const { data: bucketExists } = await supabase.storage.getBucket('car-images');
      if (!bucketExists) {
        await supabase.storage.createBucket('car-images', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
        console.log("Created 'car-images' bucket");
      }
    } catch (error) {
      console.warn("Error checking/creating bucket:", error);
      // Continue anyway, as the bucket might exist
    }
    
    // Upload each file in the images array
    for (const image of localImages) {
      if (!image.file) continue;
      
      const file = image.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${carId}/${uuidv4()}.${fileExt}`;
      
      try {
        const { data, error } = await supabase.storage
          .from('car-images')
          .upload(fileName, file, {
            upsert: true,
          });
        
        if (error) {
          console.error('Error uploading file:', error);
          toast({
            variant: "destructive",
            title: "Ошибка загрузки",
            description: `Не удалось загрузить файл: ${error.message}`
          });
          
          // Keep the original image with the local preview
          uploadResults.push(image);
        } else {
          console.log('Successfully uploaded file:', fileName);
          
          // Get public URL for the uploaded file
          const { data: { publicUrl } } = supabase.storage
            .from('car-images')
            .getPublicUrl(fileName);
          
          // Create updated image object with remote URL
          uploadResults.push({
            id: image.id,
            url: publicUrl,
            alt: image.alt
          });
          
          console.log('Image stored at public URL:', publicUrl);
        }
      } catch (uploadError) {
        console.error('Unexpected upload error:', uploadError);
        toast({
          variant: "destructive",
          title: "Ошибка загрузки",
          description: "Непредвиденная ошибка при загрузке файла"
        });
        uploadResults.push(image);
      }
    }
    
    // Get the list of all images that didn't have files to upload (external URLs)
    const externalImages = images.filter(img => !img.file);
    console.log("External images (URLs only):", externalImages.length);
    
    // Combine uploaded images with external URL images
    const allImages = [...uploadResults, ...externalImages];
    console.log("Total images after upload:", allImages.length);
    
    toast({
      title: "Загрузка завершена",
      description: `Загружено ${uploadResults.length} изображений`
    });
    
    return allImages;
  };

  return {
    uploadImageFiles
  };
};
