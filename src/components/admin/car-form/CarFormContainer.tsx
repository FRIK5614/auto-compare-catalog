
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
    reloadCars 
  } = useCars();
  
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState<Car | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  
  // Load data when component mounts
  useEffect(() => {
    reloadCars();
  }, [reloadCars]);

  // Load car data or initialize new car
  useEffect(() => {
    if (!isNewCar && id) {
      console.log("Looking for car with ID:", id);
      console.log("Available cars:", cars.length);
      
      const carData = getCarById(id);
      console.log("Found car:", carData ? "Yes" : "No");
      
      if (carData) {
        setCar(carData);
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Автомобиль не найден",
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
  }, [id, isNewCar, getCarById, navigate, toast, cars]);

  // Save car
  const handleSave = async (updatedCar: Car, imageFile?: File) => {
    if (!car) return;
    
    setLoading(true);
    
    try {
      let imageUrl: string | undefined;
      
      // Upload image if selected
      if (imageFile) {
        imageUrl = await uploadCarImage(imageFile);
        if (imageUrl) {
          // Update car with new image
          if (updatedCar.images && updatedCar.images.length > 0) {
            updatedCar.images[0].url = imageUrl;
          } else {
            updatedCar.images = [
              {
                id: updatedCar.id,
                url: imageUrl,
                alt: `${updatedCar.brand} ${updatedCar.model}`,
              }
            ];
          }
          updatedCar.image_url = imageUrl;
        }
      }
      
      if (isNewCar) {
        await addCar(updatedCar);
        toast({
          title: "Автомобиль добавлен",
          description: "Новый автомобиль успешно добавлен",
        });
      } else {
        await updateCar(updatedCar);
        toast({
          title: "Автомобиль обновлен",
          description: "Информация об автомобиле успешно обновлена",
        });
      }
      
      navigate("/admin/cars");
    } catch (error) {
      console.error("Error saving car:", error);
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: "Не удалось сохранить автомобиль",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!car) {
    return <LoadingState />;
  }

  return (
    <CarForm 
      car={car}
      isNewCar={isNewCar}
      loading={loading}
      onSave={handleSave}
      formErrors={formErrors}
    />
  );
};

export default CarFormContainer;
