
import React from "react";
import { Car } from "@/types/car";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TextFormField, 
  NumberFormField, 
  TextareaFormField,
  SelectFormField,
  BooleanRadioFormField
} from "./FormFields";

interface CarFormBasicInfoProps {
  car: Car;
}

const CarFormBasicInfo = ({ car }: CarFormBasicInfoProps) => {
  // Body type options
  const bodyTypeOptions = [
    { value: "Sedan", label: "Седан" },
    { value: "SUV", label: "Внедорожник" },
    { value: "Hatchback", label: "Хэтчбек" },
    { value: "Coupe", label: "Купе" },
    { value: "Wagon", label: "Универсал" },
    { value: "Convertible", label: "Кабриолет" }
  ];

  // Country options
  const countryOptions = [
    { value: "Германия", label: "Германия" },
    { value: "Япония", label: "Япония" },
    { value: "США", label: "США" },
    { value: "Южная Корея", label: "Южная Корея" },
    { value: "Франция", label: "Франция" },
    { value: "Италия", label: "Италия" },
    { value: "Великобритания", label: "Великобритания" },
    { value: "Китай", label: "Китай" },
    { value: "Россия", label: "Россия" }
  ];

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Основная информация</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextFormField 
            name="brand" 
            label="Марка" 
            placeholder="BMW, Audi, Mercedes..." 
          />

          <TextFormField 
            name="model" 
            label="Модель" 
            placeholder="X5, A6, E-Class..." 
          />

          <NumberFormField 
            name="year" 
            label="Год выпуска" 
            placeholder="2023" 
          />

          <NumberFormField 
            name="price.base" 
            label="Цена" 
            placeholder="3000000" 
          />

          <SelectFormField 
            name="bodyType" 
            label="Тип кузова" 
            placeholder="Выберите тип кузова"
            options={bodyTypeOptions}
          />

          <SelectFormField 
            name="country" 
            label="Страна" 
            placeholder="Выберите страну"
            options={countryOptions}
          />
        </div>

        <TextareaFormField 
          name="description" 
          label="Описание" 
          placeholder="Описание автомобиля..." 
        />

        <BooleanRadioFormField 
          name="isNew" 
          label="Состояние"
          trueLabel="Новый"
          falseLabel="С пробегом"
        />
      </CardContent>
    </Card>
  );
};

export default CarFormBasicInfo;
