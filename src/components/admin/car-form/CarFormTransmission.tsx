
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

interface CarFormTransmissionProps {
  car: Car;
  handleNumberInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCar: React.Dispatch<React.SetStateAction<Car | null>>;
  handleSelectChange: (name: string, value: string) => void;
}

const CarFormTransmission = ({
  car,
  handleNumberInputChange,
  setCar,
  handleSelectChange,
}: CarFormTransmissionProps) => {
  return (
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
  );
};

export default CarFormTransmission;
