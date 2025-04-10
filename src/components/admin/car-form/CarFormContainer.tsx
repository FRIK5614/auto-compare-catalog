
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

const CarFormContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNewCar = id === "new";
  const navigate = useNavigate();
  const saveOperationInProgress = useRef(false);
  
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
    handleRemoveImage: removeImage
  } = useImageHandling(car);
  
  // Handle save
  const { saving, saveCar } = useCarSave();
  
  // State for URL fetcher
  const [showUrlFetcher, setShowUrlFetcher] = useState(isNewCar);
  
  // External car data fetching
  const { loading: fetchLoading, fetchCarFromUrl } = useExternalCarData(setCar, setImages);

  // Initialize images when car is loaded
  useEffect(() => {
    if (car && car.images && car.id) {
      console.log("Initializing images for car:", car.id);
      initializeImagesFromCar(car);
    }
  }, [car?.id]);
  
  // Adapter functions for image handlers
  const handleImageUrlChange = (url: string) => {
    if (!car) return;
    const updatedCar = imageUrlChange(url);
    if (updatedCar) {
      setCar(updatedCar);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!car) return;
    imageUpload(e, car);
  };
  
  const handleAddImage = (url: string) => {
    if (!car) return;
    const updatedCar = addImage(url, car);
    if (updatedCar) {
      setCar(updatedCar);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    if (!car) return;
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
  const handleSave = async (updatedCar: Car, imageFile?: File) => {
    if (!car || saveOperationInProgress.current) return;
    
    saveOperationInProgress.current = true;
    setFormLoading(true);
    
    try {
      console.log("Handling save operation for car:", updatedCar.id);
      
      // Ensure images array is properly attached to the car
      updatedCar.images = images;
      
      // Call the save function with correct parameters
      const result = await saveCar(updatedCar, isNewCar);
      
      if (result.success && isNewCar) {
        console.log("Navigating back to cars list after successful save");
        navigate(`/admin/cars`);
      }
    } finally {
      setFormLoading(false);
      // Short delay to prevent accidental double submission
      setTimeout(() => {
        saveOperationInProgress.current = false;
      }, 300);
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
