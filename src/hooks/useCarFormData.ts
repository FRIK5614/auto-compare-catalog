
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useCars } from '@/hooks/useCars';
import { Car } from '@/types/car';

export const useCarFormData = (id: string | undefined, isNewCar: boolean) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    cars, 
    getCarById, 
    reloadCars,
    loading,
    error
  } = useCars();
  
  const [car, setCar] = useState<Car | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [formLoading, setFormLoading] = useState(false);
  const initialDataLoadedRef = useRef(false);
  const dataLoadAttemptedRef = useRef(false);
  const dataLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load car data
  useEffect(() => {
    if (loading || dataLoadAttemptedRef.current) return;
    
    dataLoadAttemptedRef.current = true;
    
    // Use a small timeout to debounce the data loading
    if (dataLoadTimeoutRef.current) {
      clearTimeout(dataLoadTimeoutRef.current);
    }
    
    dataLoadTimeoutRef.current = setTimeout(() => {
      if (!isNewCar && id) {
        console.log("Looking for car with ID:", id);
        
        const carData = getCarById(id);
        console.log("Found car:", carData ? "Yes" : "No");
        
        if (carData) {
          setCar(carData);
        } else if (cars.length > 0) {
          // Show error only if cars array is not empty
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Автомобиль не найден в базе данных",
          });
          navigate("/admin/cars");
        }
      } else if (!car) {
        // Initialize new car only if we don't have one already
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
    }, 300);
    
    return () => {
      if (dataLoadTimeoutRef.current) {
        clearTimeout(dataLoadTimeoutRef.current);
      }
    };
  }, [id, isNewCar, getCarById, navigate, toast, cars, loading, car]);

  // Reload cars data only once on initial mount
  useEffect(() => {
    if (!initialDataLoadedRef.current && !loading) {
      initialDataLoadedRef.current = true;
      console.log("🚀 Loading cars data - INITIAL LOAD");
      
      // Add a small delay to prevent multiple reloads
      setTimeout(() => {
        reloadCars();
      }, 300);
    }
  }, [reloadCars, loading]);

  return {
    car,
    setCar,
    formErrors,
    setFormErrors,
    formLoading,
    setFormLoading,
    loading,
    error,
    reloadCars
  };
};
