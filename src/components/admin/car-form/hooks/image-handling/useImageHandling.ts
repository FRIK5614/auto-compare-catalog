
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Car, CarImage } from '@/types/car';
import { useToast } from '@/hooks/use-toast';

export const useImageHandling = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [images, setImages] = useState<CarImage[]>([]);
  const { toast } = useToast();

  // Initialize images from car data
  const initializeImagesFromCar = useCallback((car: Car) => {
    if (car.images && Array.isArray(car.images) && car.images.length > 0) {
      setImages(car.images);
      
      // Set first image as preview if available
      if (car.images[0] && car.images[0].url) {
        setImagePreview(car.images[0].url);
      }
    } else if (car.image_url) {
      // If no images array but has image_url, create an image object
      const initialImage: CarImage = {
        id: uuidv4(),
        url: car.image_url,
        alt: `${car.brand} ${car.model}`
      };
      setImages([initialImage]);
      setImagePreview(car.image_url);
    } else {
      // Reset if no images
      setImages([]);
      setImagePreview(null);
    }
  }, []);

  // Handle image URL change
  const handleImageUrlChange = useCallback((url: string) => {
    setImagePreview(url);
    setImageFile(null);
  }, []);

  // Handle image upload from file input
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) return;

    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      setImagePreview(preview);
    };
    reader.readAsDataURL(file);
    setImageFile(file);

    // Create a new image entry for the uploaded file
    const newImage: CarImage = {
      id: uuidv4(),
      file: file,
      url: URL.createObjectURL(file),
      alt: file.name
    };

    // If this is the first image, replace the images array
    if (images.length === 0) {
      setImages([newImage]);
    }
  }, [images]);

  // Add a new image by URL
  const handleAddImage = useCallback((url: string) => {
    if (!url) return null;

    const newImage: CarImage = {
      id: uuidv4(),
      url: url,
      alt: "Image " + (images.length + 1)
    };

    return newImage;
  }, [images]);

  // Remove an image at a specific index
  const handleRemoveImage = useCallback((index: number) => {
    if (index < 0 || index >= images.length) return null;

    const updatedImages = [...images];
    updatedImages.splice(index, 1);

    // If we're removing the preview image, update the preview
    if (imagePreview === images[index].url) {
      setImagePreview(updatedImages.length > 0 ? updatedImages[0].url : null);
      setImageFile(null);
    }

    return updatedImages;
  }, [images, imagePreview]);

  // Upload image files to storage
  const uploadImageFiles = useCallback(async (carId: string) => {
    const updatedImages = [...images];
    
    // Process each image
    for (let i = 0; i < updatedImages.length; i++) {
      const image = updatedImages[i];
      
      // Skip if already a URL without a file
      if (!image.file) continue;

      try {
        // Ensure we have valid filename with extension
        const fileName = image.file.name || `image-${i}.jpg`;
        const fileExt = fileName.split('.').pop() || 'jpg';
        const filePath = `cars/${carId}/${uuidv4()}.${fileExt}`;
        
        console.log(`Uploading image to ${filePath}`);
        
        const { data, error } = await supabase.storage
          .from('vehicles')
          .upload(filePath, image.file);
        
        if (error) {
          console.error('Error uploading image:', error);
          toast({
            variant: "destructive",
            title: "Ошибка загрузки",
            description: `Не удалось загрузить изображение: ${error.message}`
          });
          continue;
        }
        
        // Get the public URL
        const { data: publicURLData } = await supabase.storage
          .from('vehicles')
          .getPublicUrl(filePath);
        
        console.log('Uploaded image, public URL:', publicURLData.publicUrl);
        
        // Update the image with the public URL
        updatedImages[i] = {
          ...image,
          url: publicURLData.publicUrl,
          file: undefined // Remove the file reference
        };
      } catch (err) {
        console.error('Error processing image upload:', err);
      }
    }
    
    setImages(updatedImages);
    return updatedImages;
  }, [images, toast]);

  return {
    imageFile,
    imagePreview,
    images,
    setImages,
    initializeImagesFromCar,
    handleImageUrlChange,
    handleImageUpload,
    handleAddImage,
    handleRemoveImage,
    uploadImageFiles
  };
};
