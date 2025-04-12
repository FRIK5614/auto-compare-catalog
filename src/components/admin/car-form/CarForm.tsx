
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Car } from "@/types/car";
import { CarFormBasicInfo, CarFormImage, CarFormTechnical } from "./index";
import { CarFormValues, carFormSchema, mapCarToFormValues, mapFormValuesToCar } from "./validation";

interface CarFormProps {
  car: Car;
  isNewCar: boolean;
  loading: boolean;
  onSave: (car: Car, imageFile?: File) => Promise<void>;
  formErrors: Record<string, any>;
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUrlChange?: (url: string) => void;
  handleAddImage?: (url: string) => void;
  handleRemoveImage?: (index: number) => void;
}

const CarForm = ({ 
  car, 
  isNewCar, 
  loading, 
  onSave, 
  formErrors,
  imagePreview,
  handleImageUpload,
  handleImageUrlChange,
  handleAddImage,
  handleRemoveImage
}: CarFormProps) => {
  const navigate = useNavigate();
  
  const methods = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    mode: "onChange",
    defaultValues: mapCarToFormValues(car),
  });
  
  const { handleSubmit, formState: { isValid, errors } } = methods;

  // Submit form
  const onSubmit = async (data: CarFormValues) => {
    console.log("Form submitted with values:", data);
    const updatedCar = mapFormValuesToCar(data, car);
    console.log("Mapped car data:", updatedCar);
    await onSave(updatedCar);
  };
  
  console.log("Rendering car form with images:", car.images?.length || 0, "images");

  return (
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
                  if (key === 'engine' || key === 'transmission' || key === 'price' || key === 'dimensions' || key === 'performance') {
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
              car={car}
              imagePreview={imagePreview}
              handleImageUpload={handleImageUpload}
              handleImageUrlChange={handleImageUrlChange}
              handleAddImage={handleAddImage}
              handleRemoveImage={handleRemoveImage}
            />

            {/* Технические характеристики */}
            <CarFormTechnical car={car} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CarForm;
