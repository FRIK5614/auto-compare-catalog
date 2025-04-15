
import React from "react";
import { useParams } from "react-router-dom";
import ImprovedCarForm from "./ImprovedCarForm";
import { useCarFormData } from "@/hooks/useCarFormData";
import { useCarFormLoader } from "./hooks/useCarFormLoader";
import CarFormLoadingState from "./CarFormLoadingState";

const ImprovedCarFormContainer = () => {
  const { id } = useParams<{ id: string }>();
  const isNewCar = !id || id === 'new';

  const {
    car,
    loading,
    error,
    isSaving,
    isDeleting,
    handleSave,
    handleDelete,
    handleCancel,
    formErrors,
    setFormErrors,
    images,
    imagePreview,
    handleImageUpload,
    handleAddImage,
    handleRemoveImage,
    reloadCars
  } = useCarFormLoader();

  const handleRetry = () => {
    if (id) {
      reloadCars();
    }
  };

  // Show loading or error state
  if (loading || error) {
    return (
      <CarFormLoadingState 
        loading={loading} 
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
      loading={isSaving}
      isDeleting={isDeleting}
      isNewCar={isNewCar}
      imagePreview={imagePreview}
      handleImageUpload={handleImageUpload}
      handleAddImage={handleAddImage}
      handleRemoveImage={handleRemoveImage}
      images={images || []}
    />
  ) : null;
};

export default ImprovedCarFormContainer;
