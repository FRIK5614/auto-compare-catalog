
import React, { useEffect, useState } from "react";
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
import { useImageHandling } from "./hooks/useImageHandling";

const ImprovedCarFormContainer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { reloadCars, getCarById } = useCars();
  const isNewCar = !id || id === 'new';
  const [loadAttempted, setLoadAttempted] = useState(false);

  const {
    car,
    setCar,
    formErrors,
    setFormErrors,
    formLoading,
    setFormLoading,
    loading,
    error,
  } = useCarFormData(id, isNewCar);

  const { saveCar, deleteCar, isSaving, isDeleting } = useCarSave();
  
  const {
    images,
    imagePreview,
    handleImageUpload,
    handleAddImage,
    handleRemoveImage,
    initializeImagesFromCar,
    uploadImageFiles
  } = useImageHandling();

  // Load car data directly if needed
  useEffect(() => {
    if (!isNewCar && !car && !loading && !loadAttempted) {
      setLoadAttempted(true);
      console.log("Directly loading car data for ID:", id);
      
      // Force reload cars to ensure we have the latest data
      reloadCars().then(() => {
        // After reloading, try to get the car again
        const loadedCar = getCarById(id || '');
        if (loadedCar) {
          console.log("Found car after reload:", loadedCar);
          setCar(loadedCar);
          initializeImagesFromCar(loadedCar);
        } else {
          console.error("Car still not found after reload");
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Автомобиль не найден"
          });
        }
      });
    }
  }, [id, car, loading, isNewCar, reloadCars, getCarById, setCar, initializeImagesFromCar, loadAttempted, toast]);

  // Listen for reload-cars event
  useEffect(() => {
    const handleReloadCars = () => {
      console.log("Handling reload-cars event");
      reloadCars();
    };
    
    window.addEventListener('reload-cars', handleReloadCars);
    
    return () => {
      window.removeEventListener('reload-cars', handleReloadCars);
    };
  }, [reloadCars]);

  useEffect(() => {
    if (car && car.id) {
      console.log("Initializing images from car:", car);
      initializeImagesFromCar(car);
    }
  }, [car, initializeImagesFromCar]);

  const handleImageUploadAdapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e, car);
  };

  const handleAddImageAdapter = (url: string) => {
    const newImage = handleAddImage(url);
    console.log("Added new image:", newImage);
  };

  const handleRemoveImageAdapter = (index: number) => {
    handleRemoveImage(index);
  };

  const handleSave = async (updatedCar: Car) => {
    setFormLoading(true);
    
    try {
      console.log("Handling save for car:", updatedCar);
      
      // First upload any local images
      if (images.some(img => img.file)) {
        toast({
          title: "Загрузка изображений",
          description: "Идет загрузка изображений на сервер..."
        });
        
        try {
          console.log("Uploading images for car ID:", updatedCar.id);
          const uploadedImages = await uploadImageFiles(updatedCar.id);
          console.log("Uploaded images:", uploadedImages);
          
          // Update car with uploaded images
          updatedCar.images = uploadedImages;
          
          if (uploadedImages.length > 0) {
            updatedCar.image_url = uploadedImages[0].url;
          }
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          toast({
            variant: "destructive",
            title: "Ошибка загрузки изображений",
            description: "Произошла ошибка при загрузке изображений, но данные автомобиля будут сохранены"
          });
        }
      } else {
        // Just assign the images array from state
        updatedCar.images = images;
        
        // Make sure image_url is set to the first image url
        if (images.length > 0) {
          updatedCar.image_url = images[0].url;
        }
      }
      
      console.log("Saving car with images:", updatedCar.images);
      
      const result = await saveCar(updatedCar, isNewCar);
      
      if (result.success) {
        toast({
          title: isNewCar ? "Автомобиль добавлен" : "Автомобиль обновлен",
          description: isNewCar
            ? "Новый автомобиль успешно добавлен в каталог"
            : "Изменения сохранены успешно",
        });
        
        console.log("Reloading cars after successful save");
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
        
        console.log("Reloading cars after successful delete");
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

  if (loading || (id && !car && !isNewCar && !loadAttempted)) {
    return <LoadingState count={3} />;
  }

  if (error) {
    return (
      <ErrorState 
        message="Не удалось загрузить данные автомобиля" 
        onRetry={() => {
          setLoadAttempted(false);
          reloadCars();
        }}
      />
    );
  }

  return car ? (
    <ImprovedCarForm
      car={car}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancel={() => navigate("/admin/cars")}
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
