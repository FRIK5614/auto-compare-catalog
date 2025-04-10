
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCars } from "@/hooks/useCars";
import { Car } from "@/types/car";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { CarFormBasicInfo, CarFormImage, CarFormTechnical } from "@/components/admin/car-form";

const AdminCarEdit = () => {
  const { id } = useParams<{ id: string }>();
  const isNewCar = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cars, getCarById, updateCar, addCar, uploadCarImage, reloadCars } = useCars();
  
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState<Car | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Перезагрузка данных автомобилей при монтировании компонента
  useEffect(() => {
    reloadCars();
  }, [reloadCars]);

  // Загрузка данных авто при монтировании компонента
  useEffect(() => {
    if (!isNewCar && id) {
      console.log("Looking for car with ID:", id);
      console.log("Available cars:", cars.length);
      
      const carData = getCarById(id);
      console.log("Found car:", carData ? "Yes" : "No");
      
      if (carData) {
        setCar(carData);
        if (carData.images && carData.images.length > 0) {
          setImagePreview(carData.images[0].url);
        } else if (carData.image_url) {
          setImagePreview(carData.image_url);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Автомобиль не найден",
        });
        navigate("/admin/cars");
      }
    } else {
      // Инициализация нового авто
      setCar({
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
      });
    }
  }, [id, isNewCar, getCarById, navigate, toast, cars]);

  // Обработка изменений базовых полей
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCar((prev) => {
      if (!prev) return null;
      
      // Обработка вложенных свойств
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        const parentObj = prev[parent as keyof typeof prev];
        
        if (typeof parentObj === 'object' && parentObj !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: value,
            },
          };
        }
        
        return prev;
      }
      
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // Обработка изменений числовых полей
  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    setCar((prev) => {
      if (!prev) return null;
      
      // Обработка вложенных свойств
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        const parentObj = prev[parent as keyof typeof prev];
        
        if (typeof parentObj === 'object' && parentObj !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: isNaN(numValue) ? 0 : numValue,
            },
          };
        }
        
        return prev;
      }
      
      return {
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      };
    });
  };

  // Обработка select полей
  const handleSelectChange = (name: string, value: string) => {
    setCar((prev) => {
      if (!prev) return null;
      
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // Обработка загрузки изображения
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Создание превью изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Сохранение автомобиля
  const handleSave = async () => {
    if (!car) return;
    
    setLoading(true);
    
    try {
      // Загрузка изображения, если оно выбрано
      if (imageFile) {
        const imageUrl = await uploadCarImage(imageFile);
        
        if (car.images && car.images.length > 0) {
          car.images[0].url = imageUrl;
        } else {
          car.images = [
            {
              id: uuidv4(),
              url: imageUrl,
              alt: `${car.brand} ${car.model}`,
            },
          ];
        }
        
        // Для совместимости с legacy полями
        car.image_url = imageUrl;
      }
      
      if (isNewCar) {
        await addCar(car);
        toast({
          title: "Автомобиль добавлен",
          description: "Новый автомобиль успешно добавлен",
        });
      } else {
        await updateCar(car);
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
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/cars")}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold">Загрузка...</h1>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/cars")}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold">
              {isNewCar ? "Добавление автомобиля" : "Редактирование автомобиля"}
            </h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            Сохранить
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Основная информация */}
          <CarFormBasicInfo
            car={car}
            handleInputChange={handleInputChange}
            handleNumberInputChange={handleNumberInputChange}
            handleSelectChange={handleSelectChange}
            setCar={setCar}
          />

          {/* Изображение */}
          <CarFormImage
            imagePreview={imagePreview}
            handleImageUpload={handleImageUpload}
          />

          {/* Технические характеристики */}
          <CarFormTechnical
            car={car}
            handleInputChange={handleInputChange}
            handleNumberInputChange={handleNumberInputChange}
            setCar={setCar}
            handleSelectChange={handleSelectChange}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCarEdit;
