import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ImprovedCarForm from "./ImprovedCarForm";
import { Button } from "@/components/ui/button";
import { useCarFormData } from "@/hooks/useCarFormData";
import { Car } from "@/types/car";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { useCarSave } from "./hooks/useCarSave";
import { useCars } from "@/contexts/cars/CarsProvider";
import { useImageHandling } from "./hooks/image-handling";

const ImprovedCarFormContainer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { reloadCars } = useCars();
  const isNewCar = !id || id === 'new';

  const {
    car,
    setCar,
    formErrors,
    setFormErrors,
    formLoading,
    setFormLoading,
    loading,
    error,
  } = useCarFormData(id);

  const { saveCar, deleteCar, isSaving, isDeleting } = useCarSave();
  
  const {
    images,
    imagePreview,
    handleImageUpload,
    handleAddImage,
    handleRemoveImage
  } = useImageHandling(car, setCar);

  useEffect(() => {
    if (loading === false && !car && !isNewCar) {
      reloadCars();
    }
  }, [loading, car, isNewCar, reloadCars]);

  const handleImageUploadAdapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!car) return;
    handleImageUpload(e, car);
  };

  const handleAddImageAdapter = (url: string) => {
    if (!car) return;
    handleAddImage(url, car);
  };

  const handleRemoveImageAdapter = (index: number) => {
    if (!car) return;
    handleRemoveImage(index, car);
  };

  const handleSave = async (updatedCar: Car) => {
    setFormLoading(true);
    
    try {
      const result = await saveCar(updatedCar, isNewCar);
      
      if (result.success) {
        toast({
          title: isNewCar ? "Автомобиль добавлен" : "Автомобиль обновлен",
          description: isNewCar
            ? "Новый автомобиль успешно добавлен в каталог"
            : "Изменения сохранены успешно",
        });
        
        await reloadCars();
        
        if (isNewCar) {
          navigate("/admin/cars");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: result.message || "Не удалось сохранить автомобиль",
        });
      }
    } catch (error) {
      console.error("Error saving car:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при сохранении",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!car) return;
    
    try {
      const success = await deleteCar(car.id);
      
      if (success) {
        toast({
          title: "Автомобиль удален",
          description: "Автомобиль успешно удален из каталога",
        });
        
        await reloadCars();
        
        navigate("/admin/cars");
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось удалить автомобиль",
        });
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при удалении",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/cars");
  };

  if (loading || (id && !car && !isNewCar)) {
    return <LoadingState count={3} />;
  }

  if (error) {
    return (
      <ErrorState 
        message="Не удалось загрузить данные автомобиля" 
        onRetry={() => reloadCars()}
      />
    );
  }

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
