
import { useState, useCallback } from 'react';
import { Car, CarImage } from '@/types/car';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { setupCarImagesBucket } from '@/services/storage/setupBucket';

export const useImageHandling = () => {
  const [images, setImages] = useState<CarImage[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  // Initialize images from car data
  const initializeImagesFromCar = useCallback((car: Car) => {
    console.log("Initializing images from car:", car.id);
    console.log("Car images:", car.images);
    console.log("Car image_url:", car.image_url);
    
    if (car.images && car.images.length > 0) {
      setImages(car.images);
      setImagePreview(car.images[0].url);
      console.log("Set images from car.images:", car.images.length);
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
        console.log("Set images from car.image_url:", [initialImage]);
      }
    } else {
      // Clear images if no car images found
      setImages([]);
      setImagePreview(null);
    }
  }, []);

  // Handle image URL change
  const handleImageUrlChange = useCallback((url: string) => {
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
  }, [toast]);

  // Handle file upload with improved multi-file support
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.log("No files selected for upload");
      return;
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
              alt: `Image ${newImages.length + 1}`,
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
        if (!imagePreview && newImages.length > 0) {
          console.log("Setting image preview to first image");
          setImagePreview(newImages[0].url);
        }
        
        // Store first file for legacy support
        if (files.length > 0) {
          setImageFile(files[0]);
        }
        
        toast({
          title: "Изображения загружены",
          description: `Добавлено ${files.length} изображений`
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
  }, [images, imagePreview, toast]);

  // Add image from URL
  const handleAddImage = useCallback((url: string) => {
    try {
      // Validate URL
      new URL(url);
      
      const newImage: CarImage = {
        id: uuidv4(),
        url: url,
        alt: "Изображение"
      };
      
      setImages(prev => [...prev, newImage]);
      
      // Set as preview if it's the first image
      if (images.length === 0) {
        setImagePreview(url);
      }
      
      toast({
        title: "Изображение добавлено",
        description: "Изображение по ссылке добавлено успешно"
      });
      
      return newImage;
    } catch (error) {
      console.error("Invalid URL format:", url);
      toast({
        variant: "destructive",
        title: "Некорректный URL",
        description: "Пожалуйста, введите действительный URL изображения"
      });
      return null;
    }
  }, [images, toast]);

  // Remove image
  const handleRemoveImage = useCallback((index: number) => {
    const updatedImages = [...images];
    
    if (index >= 0 && index < updatedImages.length) {
      updatedImages.splice(index, 1);
      setImages(updatedImages);
      
      // Update preview if needed
      if (index === 0 && updatedImages.length > 0) {
        setImagePreview(updatedImages[0].url);
      } else if (updatedImages.length === 0) {
        setImagePreview(null);
      }
      
      toast({
        title: "Изображение удалено",
        description: "Изображение удалено из галереи"
      });
    }
    
    return updatedImages;
  }, [images, toast]);

  // Upload multiple image files to Supabase storage
  const uploadImageFiles = useCallback(async (carId: string): Promise<CarImage[]> => {
    setUploading(true);
    const updatedImages = [...images];
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
          title: `${uploadErrors} изображений не загружено`,
          description: "Некоторые изображения не удалось загрузить. Попробуйте позже."
        });
      } else if (updatedImages.length > 0) {
        toast({
          title: "Все изображения загружены",
          description: `Успешно загружено ${updatedImages.length} изображений`
        });
      }
      
      console.log(`Upload process completed. Successful: ${updatedImages.length - uploadErrors}, Failed: ${uploadErrors}`);
      
      // Update the images state with the uploaded images
      setImages(updatedImages);
      
      // Update preview if needed
      if (updatedImages.length > 0 && (!imagePreview || imagePreview !== updatedImages[0].url)) {
        setImagePreview(updatedImages[0].url);
      }
      
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
  }, [images, imagePreview, toast]);

  return {
    // Image state
    images,
    setImages,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    uploading,
    
    // Image lifecycle methods
    initializeImagesFromCar,
    handleImageUrlChange,
    handleImageUpload,
    handleAddImage,
    handleRemoveImage,
    uploadImageFiles
  };
};
