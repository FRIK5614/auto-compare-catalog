
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

const ImprovedCarFormContainer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { reloadCars } = useCars();
  const isNewCar = !id;

  // Use the refactored hooks
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

  // Pre-load cars data if necessary
  useEffect(() => {
    if (loading === false && !car && !isNewCar) {
      reloadCars();
    }
  }, [loading, car, isNewCar, reloadCars]);

  const handleSave = async (updatedCar: Car) => {
    setFormLoading(true);
    
    try {
      // Attempt to save the car
      const success = await saveCar(updatedCar);
      
      if (success) {
        toast({
          title: isNewCar ? "Автомобиль добавлен" : "Автомобиль обновлен",
          description: isNewCar
            ? "Новый автомобиль успешно добавлен в каталог"
            : "Изменения сохранены успешно",
        });
        
        // Reload cars data to ensure we have the latest
        await reloadCars();
        
        // Navigate back to the cars list after saving
        if (isNewCar) {
          navigate("/admin/cars");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось сохранить автомобиль",
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
        
        // Reload cars to update the list
        await reloadCars();
        
        // Navigate back to the cars list
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

  // Render loading state
  if (loading || (id && !car)) {
    return <LoadingState type="content" text="Загрузка данных автомобиля..." />;
  }

  // Render error state
  if (error) {
    return (
      <ErrorState
        title="Ошибка загрузки"
        description="Не удалось загрузить данные автомобиля"
        action={
          <Button onClick={() => reloadCars()}>Попробовать снова</Button>
        }
      />
    );
  }

  // Render the form once data is available
  return car ? (
    <ImprovedCarForm
      car={car}
      onChange={setCar}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancel={handleCancel}
      errors={formErrors}
      setErrors={setFormErrors}
      isLoading={isSaving || formLoading}
      isDeleting={isDeleting}
      isNewCar={isNewCar}
    />
  ) : null;
};

export default ImprovedCarFormContainer;
