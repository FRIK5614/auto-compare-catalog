
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCars } from '@/hooks/useCars';
import { useToast } from '@/hooks/use-toast';
import { useCarFormData } from './useCarFormData';
import { useImageHandling } from '@/components/admin/car-form/hooks/image-handling';
import { useCarSave } from './useCarSave';
import { useCarFormHandlers } from './useCarFormHandlers';

export const useCarFormLoader = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isNewCar = !id;
  
  // Get cars data
  const carForm = useCarFormData(id, isNewCar);
  const { car, loading, error, reloadCars } = carForm;
  
  // Set up image handling
  const imageHandling = useImageHandling();
  
  // Set up saving
  const { saving, handleSaveCar, handleDelete, isDeleting } = useCarSave(
    id,
    car,
    imageHandling.images,
    imageHandling.uploadImageFiles,
    navigate
  );
  
  // Set up form handlers
  const { handleCancelEdit } = useCarFormHandlers(navigate);
  
  // Initialize car images when car data is loaded
  useEffect(() => {
    if (car && !loading) {
      imageHandling.initializeImagesFromCar(car);
    }
  }, [car, loading]);
  
  // Function to manually reload cars - ensures return type is void
  const handleReloadCars = async (): Promise<void> => {
    await reloadCars();
    return;
  };
  
  return {
    car,
    loading,
    error,
    isNewCar,
    saving,
    isDeleting,
    formErrors: carForm.formErrors,
    setFormErrors: carForm.setFormErrors,
    handleSaveCar,
    handleDelete,
    handleCancelEdit,
    reloadCars: handleReloadCars,
    ...imageHandling
  };
};
