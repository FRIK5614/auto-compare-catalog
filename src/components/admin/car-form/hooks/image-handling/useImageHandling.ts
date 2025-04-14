
import { useState, useCallback } from 'react';
import { Car, CarImage } from '@/types/car';
import { useImageInitialization } from './useImageInitialization';
import { useImagePreview } from './useImagePreview';
import { useImageUpload } from './useImageUpload';
import { useImageStorage } from './useImageStorage';

export const useImageHandling = () => {
  // Setup image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const previewHook = useImagePreview();
  
  // Image initialization hook
  const initHook = useImageInitialization(setImagePreview);
  
  // Setup image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const uploadHook = useImageUpload(initHook.images, initHook.setImages, setImagePreview);
  
  // Setup image storage
  const storageHook = useImageStorage();

  return {
    // Image state
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    images: initHook.images,
    setImages: initHook.setImages,
    
    // Image initialization
    initializeImagesFromCar: initHook.initializeImagesFromCar,
    
    // Image upload
    handleImageUpload: uploadHook.handleImageUpload,
    
    // Image preview and management
    handleImageUrlChange: previewHook.handleImageUrlChange,
    handleAddImage: previewHook.addImage,
    handleRemoveImage: (index: number) => previewHook.removeImage(index, initHook.images),
    
    // Image storage
    uploadImageFiles: (carId: string) => storageHook.uploadImageFiles(carId, initHook.images)
  };
};
