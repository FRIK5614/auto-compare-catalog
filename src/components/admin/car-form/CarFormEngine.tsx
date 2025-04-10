
import React from "react";
import { Car } from "@/types/car";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CarFormEngineProps {
  car: Car;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCar: React.Dispatch<React.SetStateAction<Car | null>>;
}

const CarFormEngine = ({
  car,
  handleInputChange,
  handleNumberInputChange,
  setCar,
}: CarFormEngineProps) => {
  return (
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
  );
};

export default CarFormEngine;
