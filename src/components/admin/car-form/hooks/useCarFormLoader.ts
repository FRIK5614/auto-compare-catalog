
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCars } from "@/contexts/cars/CarsProvider";
import { Car } from "@/types/car";
import { supabase } from "@/integrations/supabase/client";
import { transformVehicleFromSupabase } from "@/services/api/transformers";

export interface UseCarFormLoaderResult {
  car: Car | null;
  setCar: React.Dispatch<React.SetStateAction<Car | null>>;
  loading: boolean;
  formLoading: boolean;
  setFormLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  loadCarDirectlyFromSupabase: (carId: string) => Promise<Car | null>;
}

export const useCarFormLoader = (
  id: string | undefined,
  isNewCar: boolean,
  initializeImagesFromCar: (car: Car) => void
): UseCarFormLoaderResult => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { reloadCars, getCarById, loading, error } = useCars();
  
  const [car, setCar] = useState<Car | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [loadAttempted, setLoadAttempted] = useState(false);

  // Load car directly from Supabase if needed
  const loadCarDirectlyFromSupabase = useCallback(async (carId: string) => {
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
  }, [toast, initializeImagesFromCar, setFormLoading]);

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
  }, [id, car, loading, isNewCar, reloadCars, getCarById, initializeImagesFromCar, loadAttempted, toast, navigate, loadCarDirectlyFromSupabase]);

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

  return {
    car,
    setCar,
    loading,
    formLoading,
    setFormLoading,
    error,
    loadCarDirectlyFromSupabase
  };
};
