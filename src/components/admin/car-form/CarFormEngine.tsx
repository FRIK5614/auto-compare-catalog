
import React from "react";
import { Car } from "@/types/car";
import { 
  TextFormField, 
  NumberFormField,
  SelectFormField
} from "./form-fields";

interface CarFormEngineProps {
  car: Car;
}

const CarFormEngine = ({ car }: CarFormEngineProps) => {
  // Fuel type options
  const fuelTypeOptions = [
    { value: "Petrol", label: "Бензин" },
    { value: "Diesel", label: "Дизель" },
    { value: "Hybrid", label: "Гибрид" },
    { value: "Electric", label: "Электро" }
  ];

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Двигатель</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextFormField 
          name="engine.type" 
          label="Тип двигателя" 
          placeholder="V6, Inline-4..." 
        />

        <NumberFormField 
          name="engine.displacement" 
          label="Объем (л)" 
          placeholder="2.0"
          step="0.1"
        />

        <SelectFormField 
          name="engine.fuelType" 
          label="Тип топлива" 
          placeholder="Выберите тип топлива"
          options={fuelTypeOptions}
        />

        <NumberFormField 
          name="engine.power" 
          label="Мощность (л.с.)" 
          placeholder="180" 
        />

        <NumberFormField 
          name="engine.torque" 
          label="Крутящий момент (Нм)" 
          placeholder="350" 
        />
      </div>
    </div>
  );
};

export default CarFormEngine;
