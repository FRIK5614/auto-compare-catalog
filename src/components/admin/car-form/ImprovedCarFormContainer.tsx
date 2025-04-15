
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImprovedCarForm from "./ImprovedCarForm";
import { useCarFormData } from "@/hooks/useCarFormData";
import { useCars } from "@/contexts/cars/CarsProvider";
import { useImageHandling } from "./hooks/useImageHandling";
import { useCarFormLoader } from "./hooks/useCarFormLoader";
import { useCarFormHandlers } from "./hooks/useCarFormHandlers";
import CarFormLoadingState from "./CarFormLoadingState";

const ImprovedCarFormContainer = () => {
  const { id } = useParams<{ id: string }>();
  const { reloadCars } = useCars();
  const isNewCar = !id || id === 'new';
  
  const {
    images,
    imagePreview,
    handleImageUpload,
    handleAddImage,
    handleRemoveImage,
    initializeImagesFromCar,
    uploadImageFiles
  } = useImageHandling();

  const {
    car,
    setCar,
    loading,
    formLoading,
    setFormLoading,
    error,
    loadCarDirectlyFromSupabase
  } = useCarFormLoader(id, isNewCar, initializeImagesFromCar);

  // Initialize form errors from useCarFormData hook for backward compatibility
  const { formErrors, setFormErrors } = useCarFormData(id, isNewCar);

  const {
    handleSave,
    handleDelete,
    handleCancel,
    handleImageUploadAdapter,
    handleAddImageAdapter,
    handleRemoveImageAdapter,
    isSaving,
    isDeleting
  } = useCarFormHandlers(
    car,
    isNewCar,
    reloadCars,
    setFormLoading,
    images,
    handleImageUpload,
    handleAddImage,
    handleRemoveImage,
    uploadImageFiles
  );

  // Initialize images when car changes
  useEffect(() => {
    if (car && car.id) {
      console.log("Initializing images from car:", car);
      initializeImagesFromCar(car);
    }
  }, [car, initializeImagesFromCar]);

  const handleRetry = () => {
    if (id) {
      loadCarDirectlyFromSupabase(id)
        .catch(() => reloadCars());
    }
  };

  // Show loading or error state
  if (formLoading || loading || error) {
    return (
      <CarFormLoadingState 
        loading={formLoading || loading} 
        error={error}
        onRetry={handleRetry}
      />
    );
  }

  // Render the form if car is loaded
  return car ? (
    <ImprovedCarForm
      car={car}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancel={handleCancel}
      errors={formErrors}
      setErrors={setFormErrors}
      loading={isSaving || formLoading}
      isDeleting={isDeleting}
      isNewCar={isNewCar}
      imagePreview={imagePreview}
      handleImageUpload={handleImageUploadAdapter}
      handleAddImage={handleAddImageAdapter}
      handleRemoveImage={handleRemoveImageAdapter}
      images={images || []}
    />
  ) : null;
};

export default ImprovedCarFormContainer;
