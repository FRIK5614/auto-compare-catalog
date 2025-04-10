
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useCars } from '@/hooks/useCars';
import { Car } from '@/types/car';
import LoadingState from '@/components/LoadingState';
import CarForm from './CarForm';

const CarFormContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNewCar = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    cars, 
    getCarById, 
    updateCar, 
    addCar, 
    uploadCarImage, 
    reloadCars,
    loading,
    error
  } = useCars();
  
  const [formLoading, setFormLoading] = useState(false);
  const [car, setCar] = useState<Car | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  
  // Принудительная перезагрузка данных из базы при монтировании компонента
  useEffect(() => {
    reloadCars();
  }, [reloadCars]);

  // Загружаем данные автомобиля после загрузки всех автомобилей
  useEffect(() => {
    if (loading) return;
    
    if (!isNewCar && id) {
      console.log("Looking for car with ID:", id);
      console.log("Available cars:", cars.length);
      
      const carData = getCarById(id);
      console.log("Found car:", carData ? "Yes" : "No");
      
      if (carData) {
        setCar(carData);
      } else if (cars.length > 0) {
        // Показываем ошибку только если массив автомобилей не пустой
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Автомобиль не найден в базе данных",
        });
        navigate("/admin/cars");
      }
    } else {
      // Initialize new car
      const newCar: Car = {
        id: uuidv4(),
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        bodyType: "",
        colors: [],
        price: {
          base: 0,
        },
        engine: {
          type: "",
          displacement: 0,
          power: 0,
          torque: 0,
          fuelType: "",
        },
        transmission: {
          type: "",
          gears: 0,
        },
        drivetrain: "",
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
          wheelbase: 0,
          weight: 0,
          trunkVolume: 0,
        },
        performance: {
          acceleration: 0,
          topSpeed: 0,
          fuelConsumption: {
            city: 0,
            highway: 0,
            combined: 0,
          },
        },
        features: [],
        images: [],
        description: "",
        isNew: true,
        country: "",
        image_url: "",
      };
      
      setCar(newCar);
    }
  }, [id, isNewCar, getCarById, navigate, toast, cars, loading]);

  // Save car with updated logic to ensure data is properly saved
  const handleSave = async (updatedCar: Car, imageUrl?: string) => {
    if (!car) return;
    
    setFormLoading(true);
    
    try {
      // Handle image if provided
      if (imageUrl) {
        // Update car with new image
        if (updatedCar.images && updatedCar.images.length > 0) {
          updatedCar.images[0].url = imageUrl;
        } else {
          updatedCar.images = [
            {
              id: uuidv4(),
              url: imageUrl,
              alt: `${updatedCar.brand} ${updatedCar.model}`,
            }
          ];
        }
        updatedCar.image_url = imageUrl;
      }
      
      if (isNewCar) {
        await addCar(updatedCar);
        toast({
          title: "Автомобиль добавлен",
          description: "Новый автомобиль успешно добавлен в базу данных",
        });
      } else {
        await updateCar(updatedCar);
        toast({
          title: "Автомобиль обновлен",
          description: "Информация об автомобиле успешно обновлена в базе данных",
        });
      }
      
      // Принудительно обновляем данные после сохранения
      await reloadCars();
      
      // Перенаправляем пользователя на список автомобилей
      navigate("/admin/cars");
    } catch (error) {
      console.error("Error saving car:", error);
      const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: errorMessage,
      });
    } finally {
      setFormLoading(false);
    }
  };

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
          onClick={() => reloadCars()}
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
      loading={formLoading}
      onSave={handleSave}
      formErrors={formErrors}
    />
  );
};

export default CarFormContainer;
