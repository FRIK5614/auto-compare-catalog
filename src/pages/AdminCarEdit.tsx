
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCars } from "@/hooks/useCars";
import { Car } from "@/types/car";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CarFormBasicInfo, CarFormImage, CarFormTechnical } from "@/components/admin/car-form";
import { CarFormValues, carFormSchema, mapCarToFormValues, mapFormValuesToCar } from "@/components/admin/car-form/validation";

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
  
  // Initialize form with resolver
  const methods = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    mode: "onChange",
    defaultValues: {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      bodyType: "",
      country: "",
      price: {
        base: 0,
      },
      description: "",
      isNew: true,
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
    },
  });
  
  const { handleSubmit, reset, formState: { errors, isValid, isDirty } } = methods;

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
        reset(mapCarToFormValues(carData));
        
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
      reset(mapCarToFormValues(newCar));
    }
  }, [id, isNewCar, getCarById, navigate, toast, cars, reset]);

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
  const onSubmit = async (data: CarFormValues) => {
    if (!car) return;
    
    setLoading(true);
    
    try {
      let imageUrl: string | undefined;
      
      // Загрузка изображения, если оно выбрано
      if (imageFile) {
        imageUrl = await uploadCarImage(imageFile);
      }
      
      // Обновляем объект автомобиля с данными формы
      const updatedCar = mapFormValuesToCar(data, car, imageUrl);
      
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
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/cars")}
                  className="mr-2"
                  type="button"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад
                </Button>
                <h1 className="text-2xl font-bold">
                  {isNewCar ? "Добавление автомобиля" : "Редактирование автомобиля"}
                </h1>
              </div>
              <Button
                type="submit"
                disabled={loading || !isValid}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                Сохранить
              </Button>
            </div>

            {/* Отображение ошибок формы */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-6">
                <p className="font-medium">Пожалуйста, исправьте следующие ошибки:</p>
                <ul className="ml-4 list-disc">
                  {Object.entries(errors).map(([key, error]) => {
                    if (key === 'engine' || key === 'transmission' || key === 'price') {
                      return null; // Пропускаем объекты, их ошибки отображаются отдельно
                    }
                    return (
                      <li key={key}>{error?.message as string}</li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Основная информация */}
              <CarFormBasicInfo car={car} />

              {/* Изображение */}
              <CarFormImage
                imagePreview={imagePreview}
                handleImageUpload={handleImageUpload}
              />

              {/* Технические характеристики */}
              <CarFormTechnical car={car} />
            </div>
          </div>
        </form>
      </FormProvider>
    </AdminLayout>
  );
};

export default AdminCarEdit;
