
import React from "react";
import { Car } from "@/types/car";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CarFormBasicInfoProps {
  car: Car;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  setCar: React.Dispatch<React.SetStateAction<Car | null>>;
}

const CarFormBasicInfo = ({
  car,
  handleInputChange,
  handleNumberInputChange,
  handleSelectChange,
  setCar,
}: CarFormBasicInfoProps) => {
  return (
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
  );
};

export default CarFormBasicInfo;
