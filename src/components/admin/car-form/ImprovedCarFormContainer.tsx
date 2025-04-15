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
import { supabase } from "@/integrations/supabase/client";
import { transformVehicleFromSupabase } from "@/services/api/transformers";

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

  // Load car directly from Supabase if needed
  const loadCarDirectlyFromSupabase = async (carId: string) => {
    try {
      console.log("Loading car directly from Supabase with ID:", carId);
      setFormLoading(true);
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', carId)
        .single();
      
      if (error) {
        console.error("Error loading car from Supabase:", error);
        throw error;
      }
      
      if (!data) {
        console.error("Car not found in Supabase");
        throw new Error("Car not found in database");
      }
      
      console.log("Successfully loaded car from Supabase:", data);
      const transformedCar = transformVehicleFromSupabase(data);
      setCar(transformedCar);
      initializeImagesFromCar(transformedCar);
      return transformedCar;
    } catch (error) {
      console.error("Failed to load car directly from Supabase:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить данные автомобиля из базы данных"
      });
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  // Load car data directly if needed
  useEffect(() => {
    if (!isNewCar && !car && !loading && !loadAttempted) {
      setLoadAttempted(true);
      console.log("Directly loading car data for ID:", id);
      
      // First try to get the car from local state
      const localCar = getCarById(id || '');
      
      if (localCar) {
        console.log("Found car in local state:", localCar);
        setCar(localCar);
        initializeImagesFromCar(localCar);
      } else {
        // If not found in local state, load directly from Supabase
        console.log("Car not found in local state, loading from Supabase...");
        loadCarDirectlyFromSupabase(id || '')
          .then(() => console.log("Car loaded successfully from Supabase"))
          .catch(() => {
            // If still not found after direct Supabase fetch, force reload all cars
            console.log("Forcing reload of all cars");
            reloadCars().then(() => {
              // After reloading, try to get the car again from local state
              const reloadedCar = getCarById(id || '');
              if (reloadedCar) {
                console.log("Found car after reload:", reloadedCar);
                setCar(reloadedCar);
                initializeImagesFromCar(reloadedCar);
              } else {
                console.error("Car still not found after reload");
                toast({
                  variant: "destructive",
                  title: "Ошибка",
                  description: "Автомобиль не найден в базе данных"
                });
                navigate("/admin/cars");
              }
            });
          });
      }
    }
  }, [id, car, loading, isNewCar, reloadCars, getCarById, setCar, initializeImagesFromCar, loadAttempted, toast, navigate]);

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

  if (formLoading || loading) {
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
