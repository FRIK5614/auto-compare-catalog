
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCars } from "@/hooks/useCars";
import { Car } from "@/types/car";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Upload } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

const AdminCarEdit = () => {
  const { id } = useParams<{ id: string }>();
  const isNewCar = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCarById, updateCar, addCar, uploadCarImage } = useCars();
  
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState<Car | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Загрузка данных авто при монтировании компонента
  useEffect(() => {
    if (!isNewCar && id) {
      const carData = getCarById(id);
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
      });
    }
  }, [id, isNewCar, getCarById, navigate, toast]);

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
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof Car],
            [child]: value,
          },
        };
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
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof Car],
            [child]: isNaN(numValue) ? 0 : numValue,
          },
        };
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
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Марка</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={car.brand}
                    onChange={handleInputChange}
                    placeholder="BMW, Audi, Mercedes..."
                  />
                </div>
                <div>
                  <Label htmlFor="model">Модель</Label>
                  <Input
                    id="model"
                    name="model"
                    value={car.model}
                    onChange={handleInputChange}
                    placeholder="X5, A6, E-Class..."
                  />
                </div>
                <div>
                  <Label htmlFor="year">Год выпуска</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={car.year}
                    onChange={handleNumberInputChange}
                    placeholder="2023"
                  />
                </div>
                <div>
                  <Label htmlFor="price.base">Цена</Label>
                  <Input
                    id="price.base"
                    name="price.base"
                    type="number"
                    value={car.price.base}
                    onChange={handleNumberInputChange}
                    placeholder="3000000"
                  />
                </div>
                <div>
                  <Label htmlFor="bodyType">Тип кузова</Label>
                  <Select
                    value={car.bodyType}
                    onValueChange={(value) => handleSelectChange("bodyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип кузова" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedan">Седан</SelectItem>
                      <SelectItem value="SUV">Внедорожник</SelectItem>
                      <SelectItem value="Hatchback">Хэтчбек</SelectItem>
                      <SelectItem value="Coupe">Купе</SelectItem>
                      <SelectItem value="Wagon">Универсал</SelectItem>
                      <SelectItem value="Convertible">Кабриолет</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="country">Страна</Label>
                  <Select
                    value={car.country || ""}
                    onValueChange={(value) => handleSelectChange("country", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите страну" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Германия">Германия</SelectItem>
                      <SelectItem value="Япония">Япония</SelectItem>
                      <SelectItem value="США">США</SelectItem>
                      <SelectItem value="Южная Корея">Южная Корея</SelectItem>
                      <SelectItem value="Франция">Франция</SelectItem>
                      <SelectItem value="Италия">Италия</SelectItem>
                      <SelectItem value="Великобритания">Великобритания</SelectItem>
                      <SelectItem value="Китай">Китай</SelectItem>
                      <SelectItem value="Россия">Россия</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={car.description}
                  onChange={handleInputChange}
                  placeholder="Описание автомобиля..."
                  rows={5}
                />
              </div>

              <div>
                <Label>Состояние</Label>
                <RadioGroup
                  value={car.isNew ? "new" : "used"}
                  onValueChange={(value) => {
                    setCar((prev) => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        isNew: value === "new",
                      };
                    });
                  }}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new">Новый</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="used" id="used" />
                    <Label htmlFor="used">С пробегом</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Изображение */}
          <Card>
            <CardHeader>
              <CardTitle>Изображение</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
              <Label htmlFor="image" className="cursor-pointer">
                <Button variant="outline" className="w-full" asChild>
                  <div>
                    <Upload className="h-4 w-4 mr-2" />
                    Загрузить изображение
                  </div>
                </Button>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </Label>
            </CardContent>
          </Card>

          {/* Технические характеристики */}
          <Card className="col-span-1 md:col-span-3">
            <CardHeader>
              <CardTitle>Технические характеристики</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Двигатель */}
              <div>
                <h3 className="text-lg font-medium mb-2">Двигатель</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="engine.type">Тип двигателя</Label>
                    <Input
                      id="engine.type"
                      name="engine.type"
                      value={car.engine.type}
                      onChange={handleInputChange}
                      placeholder="V6, Inline-4..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="engine.displacement">Объем (л)</Label>
                    <Input
                      id="engine.displacement"
                      name="engine.displacement"
                      type="number"
                      value={car.engine.displacement}
                      onChange={handleNumberInputChange}
                      placeholder="2.0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="engine.fuelType">Тип топлива</Label>
                    <Select
                      value={car.engine.fuelType}
                      onValueChange={(value) => {
                        setCar((prev) => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            engine: {
                              ...prev.engine,
                              fuelType: value,
                            },
                          };
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип топлива" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Petrol">Бензин</SelectItem>
                        <SelectItem value="Diesel">Дизель</SelectItem>
                        <SelectItem value="Hybrid">Гибрид</SelectItem>
                        <SelectItem value="Electric">Электро</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="engine.power">Мощность (л.с.)</Label>
                    <Input
                      id="engine.power"
                      name="engine.power"
                      type="number"
                      value={car.engine.power}
                      onChange={handleNumberInputChange}
                      placeholder="180"
                    />
                  </div>
                  <div>
                    <Label htmlFor="engine.torque">Крутящий момент (Нм)</Label>
                    <Input
                      id="engine.torque"
                      name="engine.torque"
                      type="number"
                      value={car.engine.torque}
                      onChange={handleNumberInputChange}
                      placeholder="350"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Трансмиссия */}
              <div>
                <h3 className="text-lg font-medium mb-2">Трансмиссия</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="transmission.type">Тип трансмиссии</Label>
                    <Select
                      value={car.transmission.type}
                      onValueChange={(value) => {
                        setCar((prev) => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            transmission: {
                              ...prev.transmission,
                              type: value,
                            },
                          };
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип трансмиссии" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Автомат</SelectItem>
                        <SelectItem value="Manual">Механика</SelectItem>
                        <SelectItem value="CVT">Вариатор</SelectItem>
                        <SelectItem value="DCT">Робот</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="transmission.gears">Количество передач</Label>
                    <Input
                      id="transmission.gears"
                      name="transmission.gears"
                      type="number"
                      value={car.transmission.gears}
                      onChange={handleNumberInputChange}
                      placeholder="7"
                    />
                  </div>
                  <div>
                    <Label htmlFor="drivetrain">Привод</Label>
                    <Select
                      value={car.drivetrain}
                      onValueChange={(value) => handleSelectChange("drivetrain", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип привода" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FWD">Передний</SelectItem>
                        <SelectItem value="RWD">Задний</SelectItem>
                        <SelectItem value="AWD">Полный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCarEdit;
