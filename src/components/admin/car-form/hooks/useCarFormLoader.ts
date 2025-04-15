
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
  const { isSaving, saveCar, deleteCar, isDeleting } = useCarSave();
  
  // Set up form handlers
  const { handleCancel } = useCarFormHandlers(navigate);
  
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

  // Create the save handler using the saveCar function
  const handleSave = async (updatedCar: any) => {
    if (!car) return;
    
    try {
      // Upload any local images if needed
      if (imageHandling.images.some(img => img.file)) {
        const uploadedImages = await imageHandling.uploadImageFiles(updatedCar.id);
        updatedCar.images = uploadedImages;
      } else {
        updatedCar.images = imageHandling.images;
      }
      
      // Save the car
      await saveCar(updatedCar, isNewCar);
      
      if (isNewCar) {
        navigate('/admin/cars');
      }
    } catch (error) {
      console.error("Error saving car:", error);
    }
  };

  // Create delete handler
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteCar(id);
      navigate('/admin/cars');
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };
  
  return {
    car,
    loading,
    error,
    isNewCar,
    isSaving,
    isDeleting,
    formErrors: carForm.formErrors,
    setFormErrors: carForm.setFormErrors,
    handleSave,
    handleDelete,
    handleCancel,
    reloadCars: handleReloadCars,
    ...imageHandling
  };
};
