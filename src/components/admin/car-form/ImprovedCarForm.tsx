
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash } from "lucide-react";
import { Car, CarImage } from "@/types/car";
import { CarFormBasicInfo, CarFormTechnical } from "./index";
import { CarFormValues, carFormSchema, mapCarToFormValues, mapFormValuesToCar } from "./validation";
import ImprovedCarFormImage from "./ImprovedCarFormImage";
import { useToast } from "@/hooks/use-toast";

interface ImprovedCarFormProps {
  car: Car;
  isNewCar: boolean;
  loading: boolean;
  isDeleting: boolean;
  onSave: (car: Car) => Promise<void>;
  onDelete: () => Promise<void>;
  onCancel: () => void;
  errors: Record<string, any>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddImage?: (url: string) => void;
  handleRemoveImage?: (index: number) => void;
  images: CarImage[];
}

const ImprovedCarForm = ({ 
  car, 
  isNewCar, 
  loading, 
  isDeleting,
  onSave, 
  onDelete,
  onCancel,
  errors: formErrors,
  setErrors: setFormErrors,
  imagePreview,
  handleImageUpload,
  handleAddImage,
  handleRemoveImage,
  images
}: ImprovedCarFormProps) => {
  const { toast } = useToast();
  
  const methods = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    mode: "onChange",
    defaultValues: mapCarToFormValues(car),
  });
  
  const { handleSubmit, formState: { isValid, errors }, reset } = methods;

  // Reset form when car changes
  React.useEffect(() => {
    if (car) {
      const formValues = mapCarToFormValues(car);
      console.log("Resetting form with values:", formValues);
      reset(formValues);
    }
  }, [car, reset]);

  // Submit form
  const onSubmit = async (data: CarFormValues) => {
    console.log("Form submitted with values:", data);
    try {
      const updatedCar = mapFormValuesToCar(data, car);
      console.log("Mapped car data:", updatedCar);
      
      // Make sure images are preserved
      updatedCar.images = images;
      
      await onSave(updatedCar);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при сохранении данных"
      });
    }
  };
  
  console.log("Rendering improved car form with images:", images?.length || 0, "images");
  console.log("Form validation state:", isValid, "errors:", Object.keys(errors).length);
  console.log("Form errors:", errors);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={onCancel}
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
            <div className="flex gap-2">
              {!isNewCar && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isDeleting || loading}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Удалить
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                Сохранить
              </Button>
            </div>
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
            <ImprovedCarFormImage
              car={car}
              imagePreview={imagePreview}
              handleImageUpload={handleImageUpload}
              handleAddImage={handleAddImage}
              handleRemoveImage={handleRemoveImage}
              images={images}
            />

            {/* Технические характеристики */}
            <CarFormTechnical car={car} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ImprovedCarForm;
