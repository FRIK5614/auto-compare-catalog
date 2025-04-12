
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import LoadingState from '@/components/LoadingState';
import ImprovedCarForm from './ImprovedCarForm';
import CarUrlFetcher from './CarUrlFetcher';
import { Car } from '@/types/car';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { transformVehicleFromSupabase, transformVehicleForSupabase } from '@/services/api/transformers';
import { useImprovedImageHandling } from './hooks/image-handling/useImprovedImageHandling';

const ImprovedCarFormContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNewCar = id === "new";
  const navigate = useNavigate();
  const saveOperationInProgress = useRef(false);
  const { toast } = useToast();
  
  const [car, setCar] = useState<Car | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const {
    images,
    imagePreview,
    initializeImagesFromCar,
    handleAddImage,
    handleImageUpload,
    handleRemoveImage,
    uploadImageFiles
  } = useImprovedImageHandling();
  
  const [showUrlFetcher, setShowUrlFetcher] = useState(isNewCar);
  const [fetchLoading, setFetchLoading] = useState(false);

  // Load car data directly from Supabase
  useEffect(() => {
    if (isNewCar) {
      // Create a new car template
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
      setLoading(false);
      return;
    }
    
    const fetchCar = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        console.log(`[API] Loading car with ID ${id} from Supabase`);
        
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Автомобиль не найден в базе данных",
          });
          navigate("/admin/cars");
          return;
        }
        
        // Transform data from Supabase to Car type
        const carData = transformVehicleFromSupabase(data);
        console.log("Loaded car data:", carData);
        setCar(carData);
        
        // Initialize images
        if (carData.images) {
          initializeImagesFromCar(carData);
        }
      } catch (err) {
        console.error("Error loading car:", err);
        setError("Не удалось загрузить данные автомобиля");
        toast({
          variant: "destructive",
          title: "Ошибка загрузки",
          description: "Не удалось загрузить данные автомобиля из базы данных",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCar();
  }, [id, isNewCar, navigate, toast, initializeImagesFromCar]);
  
  useEffect(() => {
    if (car && car.id) {
      initializeImagesFromCar(car);
    }
  }, [car?.id, initializeImagesFromCar]);
  
  const handleImageUrlAdd = (url: string) => {
    if (!car) return;
    const updatedCar = handleAddImage(url, car);
    if (updatedCar) {
      setCar(updatedCar);
    }
  };
  
  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!car) return;
    const updatedCar = handleImageUpload(e, car);
    if (updatedCar) {
      setCar(updatedCar);
    }
  };
  
  const handleImageRemove = (index: number) => {
    if (!car) return;
    const updatedCar = handleRemoveImage(index, car);
    if (updatedCar) {
      setCar(updatedCar);
    }
  };
  
  const fetchCarFromUrl = async (url: string) => {
    setFetchLoading(true);
    
    try {
      // You can implement external car data fetching here
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch car data");
      }
      
      const data = await response.json();
      
      if (!data) {
        throw new Error("No data received");
      }
      
      // Process the data and create a car object
      const newCar: Car = {
        id: uuidv4(),
        brand: data.brand || "",
        model: data.model || "",
        year: data.year || new Date().getFullYear(),
        bodyType: data.bodyType || "",
        colors: data.colors || [],
        price: data.price || { base: 0 },
        engine: data.engine || {
          type: "",
          displacement: 0,
          power: 0,
          torque: 0,
          fuelType: "",
        },
        transmission: data.transmission || {
          type: "",
          gears: 0,
        },
        drivetrain: data.drivetrain || "",
        dimensions: data.dimensions || {
          length: 0,
          width: 0,
          height: 0,
          wheelbase: 0,
          weight: 0,
          trunkVolume: 0,
        },
        performance: data.performance || {
          acceleration: 0,
          topSpeed: 0,
          fuelConsumption: {
            city: 0,
            highway: 0,
            combined: 0,
          },
        },
        features: data.features || [],
        images: data.images || [],
        description: data.description || "",
        isNew: data.isNew !== undefined ? data.isNew : true,
        country: data.country || "",
        image_url: data.image_url || "",
      };
      
      setCar(newCar);
      
      if (newCar.images && newCar.images.length > 0) {
        initializeImagesFromCar(newCar);
      }
      
      return true;
    } catch (error) {
      console.error("Error fetching car:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить данные автомобиля по URL",
      });
      return false;
    } finally {
      setFetchLoading(false);
    }
  };

  const handleCarFromUrl = async (url: string) => {
    setFormLoading(true);
    const success = await fetchCarFromUrl(url);
    setFormLoading(false);
    
    if (success) {
      setShowUrlFetcher(false);
    }
  };

  const handleSave = async (updatedCar: Car) => {
    if (!car || saveOperationInProgress.current) return;
    
    saveOperationInProgress.current = true;
    setFormLoading(true);
    
    try {
      console.log("Saving car with images:", images?.length || 0, "images");
      
      // Ensure images are properly attached
      updatedCar.images = images;
      
      // Make sure main image is set
      if (images.length > 0) {
        updatedCar.image_url = images[0].url;
      }
      
      // Check if we have local images that need uploading
      if (images.some(img => img.file)) {
        console.log("Uploading local images to storage...");
        toast({
          title: "Загрузка изображений",
          description: "Идет загрузка изображений на сервер..."
        });
        
        try {
          const uploadedImages = await uploadImageFiles(updatedCar.id);
          updatedCar.images = uploadedImages;
          
          if (uploadedImages.length > 0) {
            updatedCar.image_url = uploadedImages[0].url;
            console.log("Updated main image URL to:", updatedCar.image_url);
          }
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          toast({
            variant: "destructive",
            title: "Ошибка загрузки изображений",
            description: "Произошла ошибка при загрузке изображений, но данные автомобиля будут сохранены"
          });
        }
      }
      
      // Transform car object to Supabase format
      const vehicleData = transformVehicleForSupabase(updatedCar);
      
      if (isNewCar) {
        // Insert new car
        const { data, error } = await supabase
          .from('vehicles')
          .insert(vehicleData)
          .select();
        
        if (error) {
          throw error;
        }
        
        console.log("New car inserted:", data);
        
        toast({
          title: "Автомобиль добавлен",
          description: `${updatedCar.brand} ${updatedCar.model} успешно добавлен`
        });
        
        navigate("/admin/cars");
      } else {
        // Update existing car
        const { data, error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', updatedCar.id)
          .select();
        
        if (error) {
          throw error;
        }
        
        console.log("Car updated:", data);
        
        toast({
          title: "Автомобиль обновлен",
          description: `${updatedCar.brand} ${updatedCar.model} успешно обновлен`
        });
      }
    } catch (error) {
      console.error("Error saving car:", error);
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: "Произошла ошибка при сохранении автомобиля"
      });
    } finally {
      setFormLoading(false);
      setTimeout(() => {
        saveOperationInProgress.current = false;
      }, 500);
    }
  };

  if (showUrlFetcher && isNewCar) {
    return (
      <CarUrlFetcher 
        onFetch={handleCarFromUrl} 
        onSkip={() => setShowUrlFetcher(false)}
        loading={formLoading || fetchLoading}
      />
    );
  }

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
          onClick={() => window.location.reload()}
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
    <ImprovedCarForm 
      car={car}
      isNewCar={isNewCar}
      loading={formLoading}
      onSave={handleSave}
      formErrors={formErrors}
      handleAddImage={handleImageUrlAdd}
      handleRemoveImage={handleImageRemove}
      imagePreview={imagePreview}
      handleImageUpload={handleMultipleImageUpload}
      images={images}
    />
  );
};

export default ImprovedCarFormContainer;
