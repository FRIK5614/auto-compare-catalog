
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useCars } from '@/hooks/useCars';
import { useTmcAvtoCatalog } from '@/hooks/useTmcAvtoCatalog';
import { Car } from '@/types/car';
import LoadingState from '@/components/LoadingState';
import CarForm from './CarForm';
import CarUrlFetcher from './CarUrlFetcher';

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
  
  const { fetchCatalogData } = useTmcAvtoCatalog();
  
  const [formLoading, setFormLoading] = useState(false);
  const [car, setCar] = useState<Car | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [showUrlFetcher, setShowUrlFetcher] = useState(isNewCar);
  const [images, setImages] = useState<{ id: string, url: string, alt: string }[]>([]);
  
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
        if (carData.images) {
          setImages(carData.images);
        }
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

  // Handle car data from URL
  const handleCarFromUrl = async (url: string) => {
    setFormLoading(true);
    
    try {
      const result = await fetchCatalogData({ url });
      
      if (result && result.length > 0) {
        const importedCar = result[0];
        
        // Create a new car object from the imported data
        const newCar: Car = {
          id: uuidv4(),
          brand: importedCar.brand || "",
          model: importedCar.model || "",
          year: importedCar.year || new Date().getFullYear(),
          bodyType: "",
          colors: [],
          price: {
            base: importedCar.price || 0,
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
          images: importedCar.imageUrl 
            ? [{ id: uuidv4(), url: importedCar.imageUrl, alt: `${importedCar.brand} ${importedCar.model}` }] 
            : [],
          description: `Импортировано из каталога: ${url}`,
          isNew: true,
          country: importedCar.country || "",
          image_url: importedCar.imageUrl || "",
        };
        
        setCar(newCar);
        if (newCar.images) {
          setImages(newCar.images);
        }
        
        setShowUrlFetcher(false);
        
        toast({
          title: "Данные получены",
          description: `Импортированы данные для ${newCar.brand} ${newCar.model}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка импорта",
          description: "Не удалось получить данные об автомобиле по указанному URL",
        });
      }
    } catch (error) {
      console.error("Error fetching car data:", error);
      toast({
        variant: "destructive",
        title: "Ошибка импорта",
        description: "Произошла ошибка при получении данных. Проверьте URL и попробуйте снова.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Handle image URL change
  const handleImageUrlChange = (url: string) => {
    if (!car) return;
    
    const updatedCar = {...car};
    updatedCar.image_url = url;
    
    // Also update the first image if it exists
    if (updatedCar.images && updatedCar.images.length > 0) {
      updatedCar.images[0].url = url;
    } else {
      updatedCar.images = [
        {
          id: uuidv4(),
          url: url,
          alt: `${updatedCar.brand} ${updatedCar.model}`,
        }
      ];
    }
    
    setImages(updatedCar.images);
    setCar(updatedCar);
  };

  // Handle adding a new image
  const handleAddImage = (url: string) => {
    if (!car) return;
    
    const newImage = {
      id: uuidv4(),
      url: url,
      alt: `${car.brand} ${car.model} - Изображение ${(images.length || 0) + 1}`,
    };
    
    const updatedImages = [...(images || []), newImage];
    setImages(updatedImages);
    
    // Update car object
    const updatedCar = {...car};
    updatedCar.images = updatedImages;
    
    // If this is the first image, also set it as the main image
    if (updatedImages.length === 1 || !updatedCar.image_url) {
      updatedCar.image_url = url;
    }
    
    setCar(updatedCar);
  };

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    if (!car || !images) return;
    
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    
    // Update car object
    const updatedCar = {...car};
    updatedCar.images = updatedImages;
    
    // If we removed the main image, update the main image URL
    if (index === 0 || updatedImages.length === 0) {
      updatedCar.image_url = updatedImages.length > 0 ? updatedImages[0].url : "";
    }
    
    setCar(updatedCar);
  };

  // Save car with updated logic to ensure data is properly saved
  const handleSave = async (updatedCar: Car, imageFile?: File) => {
    if (!car) return;
    
    setFormLoading(true);
    
    try {
      // Ensure images array is properly attached to the car
      updatedCar.images = images;
      
      // Handle image file if provided
      if (imageFile) {
        try {
          const imageUrl = await uploadCarImage(imageFile);
          
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
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({
            variant: "destructive",
            title: "Ошибка загрузки изображения",
            description: "Не удалось загрузить изображение. Пожалуйста, попробуйте снова.",
          });
          // Continue with saving even if image upload fails
        }
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

  if (showUrlFetcher && isNewCar) {
    return (
      <CarUrlFetcher 
        onFetch={handleCarFromUrl} 
        onSkip={() => setShowUrlFetcher(false)}
        loading={formLoading}
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
      handleImageUrlChange={handleImageUrlChange}
      handleAddImage={handleAddImage}
      handleRemoveImage={handleRemoveImage}
    />
  );
};

export default CarFormContainer;
