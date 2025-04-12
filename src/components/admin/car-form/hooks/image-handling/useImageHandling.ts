
import { useState, useCallback } from 'react';
import { Car, CarImage } from '@/types/car';
import { useImageInitialization } from './useImageInitialization';
import { useImagePreview } from './useImagePreview';
import { useImageUpload } from './useImageUpload';
import { useImageStorage } from './useImageStorage';

export const useImageHandling = () => {
  // Setup image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const previewHook = useImagePreview(setImagePreview);
  
  // Image initialization hook
  const initHook = useImageInitialization(setImagePreview);
  
  // Setup image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const uploadHook = useImageUpload(setImagePreview, setImageFile, initHook.setImages);
  
  // Setup image storage
  const storageHook = useImageStorage(initHook.images);

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
    handleImageUrlChange: uploadHook.handleImageUrlChange,
    handleAddImage: uploadHook.handleAddImage,
    handleRemoveImage: uploadHook.handleRemoveImage,
    
    // Image storage
    uploadImageFiles: storageHook.uploadImageFiles
  };
};
