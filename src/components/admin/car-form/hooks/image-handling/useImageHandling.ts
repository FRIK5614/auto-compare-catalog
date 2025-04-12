
import { Car } from '@/types/car';
import { useImagePreview } from './useImagePreview';
import { useImageInitialization } from './useImageInitialization';
import { useImageUpload } from './useImageUpload';
import { useImageStorage } from './useImageStorage';

export const useImageHandling = (initialCar: Car | null) => {
  // Use specialized hooks
  const { 
    imagePreview, 
    setImagePreview, 
    handleImageUrlChange: imageUrlChange, 
    addImage, 
    removeImage 
  } = useImagePreview();
  
  const { 
    images, 
    setImages, 
    initializeImagesFromCar 
  } = useImageInitialization(setImagePreview);
  
  const { 
    imageFile, 
    setImageFile, 
    handleImageUpload: imageUpload 
  } = useImageUpload(images, setImages, setImagePreview);
  
  const { 
    uploadImageFiles: uploadImages 
  } = useImageStorage();

  // Adapter functions that simplify the API by connecting hooks together
  const handleImageUrlChange = (url: string) => {
    const updatedCar = imageUrlChange(url, initialCar);
    return updatedCar;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!initialCar) return;
    imageUpload(e, initialCar);
  };

  const handleAddImage = (url: string, car: Car) => {
    return addImage(url, car);
  };

  const handleRemoveImage = (index: number, car: Car) => {
    return removeImage(index, car, images);
  };

  const uploadImageFiles = async (carId: string) => {
    return await uploadImages(carId, images);
  };

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
