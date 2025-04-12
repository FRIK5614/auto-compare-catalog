
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import LoadingState from '@/components/LoadingState';
import CarForm from './CarForm';
import CarUrlFetcher from './CarUrlFetcher';
import { useCarFormData } from './hooks/useCarFormData';
import { useImageHandling } from './hooks/useImageHandling';
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
  
  // Get car data
  const {
    car,
    setCar,
    formErrors,
    formLoading,
    setFormLoading,
    loading,
    error,
  } = useCarFormData(id, isNewCar);
  
  // Handle images
  const {
    imageFile,
    imagePreview,
    images,
    setImages,
    initializeImagesFromCar,
    handleImageUrlChange: imageUrlChange,
    handleImageUpload: imageUpload,
    handleAddImage: addImage,
    handleRemoveImage: removeImage,
    uploadImageFiles
  } = useImageHandling(car);
  
  // Handle save
  const { saving, saveCar } = useCarSave();
  
  // State for URL fetcher
  const [showUrlFetcher, setShowUrlFetcher] = useState(isNewCar);
  
  // External car data fetching
  const { loading: fetchLoading, fetchCarFromUrl } = useExternalCarData(setCar, setImages);

  // Initialize images when car is loaded
  useEffect(() => {
    if (car && car.id) {
      console.log("Initializing images for car:", car.id, car.images?.length || 0, "images");
      initializeImagesFromCar(car);
    }
  }, [car?.id]);
  
  // Adapter functions for image handlers
  const handleImageUrlChange = (url: string) => {
    if (!car) return;
    console.log("Changing image URL to:", url);
    const updatedCar = imageUrlChange(url);
    if (updatedCar) {
      setCar(updatedCar);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!car) return;
    console.log("Uploading images:", e.target.files?.length || 0, "files");
    imageUpload(e, car);
  };
  
  const handleAddImage = (url: string) => {
    if (!car) return;
    console.log("Adding image by URL:", url);
    const updatedCar = addImage(url, car);
    if (updatedCar) {
      setCar(updatedCar);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    if (!car) return;
    console.log("Removing image at index:", index);
    const updatedCar = removeImage(index, car);
    if (updatedCar) {
      setCar(updatedCar);
    }
  };

  // Handle car data from URL
  const handleCarFromUrl = async (url: string) => {
    setFormLoading(true);
    const success = await fetchCarFromUrl(url);
    setFormLoading(false);
    
    if (success) {
      setShowUrlFetcher(false);
    }
  };

  // Save car 
  const handleSave = async (updatedCar: Car) => {
    if (!car || saveOperationInProgress.current) return;
    
    saveOperationInProgress.current = true;
    setFormLoading(true);
    
    try {
      console.log("Saving car with images:", images?.length || 0, "images");
      
      // Ensure images array is properly attached to the car
      updatedCar.images = images;
      
      // Upload any local images to storage
      if (images.some(img => img.file)) {
        console.log("Uploading local images to storage...");
        toast({
          title: "Загрузка изображений",
          description: "Идет загрузка изображений на сервер..."
        });
        
        try {
          const uploadedImages = await uploadImageFiles(updatedCar.id);
          updatedCar.images = uploadedImages;
          
          // Update main image URL if necessary
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
      
      // Call the save function with correct parameters
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
      // Short delay to prevent accidental double submission
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
      loading={formLoading || saving}
      onSave={handleSave}
      formErrors={formErrors}
      handleImageUrlChange={handleImageUrlChange}
      handleAddImage={handleAddImage}
      handleRemoveImage={handleRemoveImage}
      imagePreview={imagePreview}
      handleImageUpload={handleImageUpload}
    />
  );
};

export default CarFormContainer;
