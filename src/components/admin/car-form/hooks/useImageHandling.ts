
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Car, CarImage } from '@/types/car';
import { supabase } from '@/integrations/supabase/client';

export const useImageHandling = (initialCar: Car | null) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [images, setImages] = useState<CarImage[]>([]);

  // Initialize images from car
  const initializeImagesFromCar = (car: Car) => {
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
    }
  };

  // Handle image URL change
  const handleImageUrlChange = (url: string) => {
    if (!initialCar) return null;
    
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

  // Handle multiple image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, car: Car) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Handle multiple files
    const files = Array.from(e.target.files);
    console.log("Processing", files.length, "image files");
    
    const newImages = [...images]; // Copy current images
    
    // Process each file
    files.forEach((file) => {
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
        
        // Update state after all files are processed
        setImages(newImages);
        
        // Set first image as preview if we don't have one
        if (!imagePreview || newImages.length === 1) {
          setImagePreview(preview);
        }
        
        console.log("Added image from file:", newImage.id);
      };
      
      reader.readAsDataURL(file);
    });
    
    // Update original file for legacy support
    if (files.length > 0) {
      setImageFile(files[0]);
    }
  };

  // Handle adding a new image by URL
  const addImage = (url: string, car: Car) => {
    if (!car) return null;
    
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
    
    console.log("Added image by URL:", newImage.id, "Total images:", updatedImages.length);
    return updatedCar;
  };

  // Handle removing an image
  const removeImage = (index: number, car: Car) => {
    if (!car || !images) return null;
    
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
    
    console.log("Removed image at index:", index, "Total images:", updatedImages.length);
    return updatedCar;
  };

  // Upload physical files to Supabase Storage
  const uploadImageFiles = async (carId: string) => {
    const uploadResults = [];
    
    // Filter images that have a file property (meaning they are local files)
    const localImages = images.filter(img => img.file);
    
    if (localImages.length === 0) {
      console.log("No local images to upload to storage");
      return images; // Return original images if no local files to upload
    }
    
    console.log(`Uploading ${localImages.length} images to Supabase Storage`);
    
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
        uploadResults.push(image);
      }
    }
    
    // Get the list of all images that didn't have files to upload (external URLs)
    const externalImages = images.filter(img => !img.file);
    console.log("External images (URLs only):", externalImages.length);
    
    // Combine uploaded images with external URL images
    const allImages = [...uploadResults, ...externalImages];
    console.log("Total images after upload:", allImages.length);
    
    // Update the state with the new image URLs
    setImages(allImages);
    
    // If we have a main image, update it
    if (allImages.length > 0 && (!imagePreview || allImages[0].id === images[0]?.id)) {
      setImagePreview(allImages[0].url);
    }
    
    return allImages;
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
    handleRemoveImage: removeImage,
    uploadImageFiles
  };
};
