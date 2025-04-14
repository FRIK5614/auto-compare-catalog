
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import LoadingState from '@/components/LoadingState';
import CarForm from './CarForm';
import CarUrlFetcher from './CarUrlFetcher';
import { useCarFormData } from './hooks/useCarFormData';
import { useImageHandling } from './hooks/image-handling';
import { useCarSave } from './hooks/useCarSave';
import { useExternalCarData } from './hooks/useExternalCarData';
import { Car } from '@/types/car';
import { useToast } from '@/hooks/use-toast';

const CarFormContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNewCar = id === "new";
  const navigate = useNavigate();
  const saveOperationInProgress = useRef(false);
  const { toast } = useToast();
  
  const {
    car,
    setCar,
    formErrors,
    formLoading,
    setFormLoading,
    loading,
    error,
  } = useCarFormData(id, isNewCar);
  
  const {
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
  } = useImageHandling();
  
  const { isSaving, saveCar } = useCarSave();
  
  const [showUrlFetcher, setShowUrlFetcher] = useState(isNewCar);
  
  const { loading: fetchLoading, fetchCarFromUrl } = useExternalCarData(setCar, setImages);

  useEffect(() => {
    if (car && car.id) {
      console.log("Initializing images for car:", car.id, car.images?.length || 0, "images");
      initializeImagesFromCar(car);
    }
  }, [car?.id, initializeImagesFromCar]);
  
  const handleImageUrlChangeWrapper = (url: string) => {
    if (!car) return;
    console.log("Changing image URL to:", url);
    
    // Update the image preview
    handleImageUrlChange(url);
    
    if (car.images && car.images.length > 0) {
      // Update the first image if it exists
      const updatedImages = [...car.images];
      updatedImages[0].url = url;
      setImages(updatedImages);
      
      // Also update the car's main image URL
      setCar({
        ...car,
        image_url: url,
        images: updatedImages
      });
    } else {
      // Create a new image
      const newImage = {
        id: uuidv4(),
        url: url,
        alt: `${car.brand} ${car.model}`
      };
      
      setImages([newImage]);
      
      // Update the car with the new image
      setCar({
        ...car,
        image_url: url,
        images: [newImage]
      });
    }
  };
  
  const handleImageUploadWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!car) return;
    console.log("Uploading images:", e.target.files?.length || 0, "files");
    handleImageUpload(e, car);
  };
  
  const handleAddImageWrapper = (url: string) => {
    if (!car) return;
    console.log("Adding image by URL:", url);
    
    const newImage = handleAddImage(url, car);
    
    if (newImage) {
      const updatedImages = [...images, newImage];
      setImages(updatedImages);
      
      // Update the car object with the new images
      setCar({
        ...car,
        images: updatedImages,
        // If this is the first image, set it as the main image
        image_url: car.image_url || newImage.url
      });
    }
  };
  
  const handleRemoveImageWrapper = (index: number) => {
    if (!car) return;
    console.log("Removing image at index:", index);
    
    const updatedImages = handleRemoveImage(index, car);
    
    if (updatedImages) {
      setImages(updatedImages);
      
      // If we removed the main image, update the main image URL
      const newMainUrl = index === 0 && updatedImages.length > 0 
        ? updatedImages[0].url 
        : (index === 0 ? "" : car.image_url);
      
      setCar({
        ...car,
        images: updatedImages,
        image_url: newMainUrl
      });
    }
  };

  const handleCarFromUrl = async (url: string) => {
    setFormLoading(true);
    const success = await fetchCarFromUrl(url);
    setFormLoading(false);
    
    if (success) {
      setShowUrlFetcher(false);
    }
  };

  const handleSave = async (updatedCar: Car) => {
    if (!car || saveOperationInProgress.current) return;
    
    saveOperationInProgress.current = true;
    setFormLoading(true);
    
    try {
      console.log("Saving car with images:", images?.length || 0, "images");
      
      updatedCar.images = images;
      
      if (images.some(img => img.file)) {
        console.log("Uploading local images to storage...");
        toast({
          title: "Загрузка изображений",
          description: "Идет загрузка изображений на сервер..."
        });
        
        try {
          const uploadedImages = await uploadImageFiles(updatedCar.id);
          updatedCar.images = uploadedImages;
          
          if (uploadedImages.length > 0) {
            updatedCar.image_url = uploadedImages[0].url;
            console.log("Updated main image URL to:", updatedCar.image_url);
          }
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          toast({
            variant: "destructive",
            title: "Ошибка загрузки изображений",
            description: "Произошла ошибка при загрузке изображений, но данные автомобиля будут сохранены"
          });
        }
      }
      
      const result = await saveCar(updatedCar, isNewCar);
      
      if (result.success) {
        toast({
          title: isNewCar ? "Автомобиль добавлен" : "Автомобиль обновлен",
          description: `${updatedCar.brand} ${updatedCar.model} успешно ${isNewCar ? "добавлен" : "обновлен"}`
        });
        
        if (isNewCar) {
          console.log("Navigating back to cars list after successful save");
          navigate(`/admin/cars`);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка сохранения",
          description: result.message || "Произошла ошибка при сохранении автомобиля"
        });
      }
    } catch (error) {
      console.error("Error in save handler:", error);
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: "Произошла непредвиденная ошибка при сохранении автомобиля"
      });
    } finally {
      setFormLoading(false);
      setTimeout(() => {
        saveOperationInProgress.current = false;
      }, 500);
    }
  };

  if (showUrlFetcher && isNewCar) {
    return (
      <CarUrlFetcher 
        onFetch={handleCarFromUrl} 
        onSkip={() => setShowUrlFetcher(false)}
        loading={formLoading || fetchLoading}
      />
    );
  }

  if (loading) {
    return <LoadingState count={3} />;
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ошибка загрузки данных</h2>
        <p className="mb-6 text-auto-gray-600">{error}</p>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!car) {
    return <LoadingState count={3} />;
  }

  return (
    <CarForm 
      car={car}
      isNewCar={isNewCar}
      loading={formLoading || isSaving}
      onSave={handleSave}
      formErrors={formErrors}
      handleImageUrlChange={handleImageUrlChangeWrapper}
      handleAddImage={handleAddImageWrapper}
      handleRemoveImage={handleRemoveImageWrapper}
      imagePreview={imagePreview}
      handleImageUpload={handleImageUploadWrapper}
    />
  );
};

export default CarFormContainer;
