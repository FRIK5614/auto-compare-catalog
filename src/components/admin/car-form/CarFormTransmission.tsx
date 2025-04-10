
import React from "react";
import { Car } from "@/types/car";
import { 
  NumberFormField,
  SelectFormField
} from "./form-fields";

interface CarFormTransmissionProps {
  car: Car;
}

const CarFormTransmission = ({ car }: CarFormTransmissionProps) => {
  // Transmission type options
  const transmissionTypeOptions = [
    { value: "Automatic", label: "Автомат" },
    { value: "Manual", label: "Механика" },
    { value: "CVT", label: "Вариатор" },
    { value: "DCT", label: "Робот" }
  ];

  // Drivetrain options
  const drivetrainOptions = [
    { value: "FWD", label: "Передний" },
    { value: "RWD", label: "Задний" },
    { value: "AWD", label: "Полный" }
  ];

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Трансмиссия</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectFormField 
          name="transmission.type" 
          label="Тип трансмиссии" 
          placeholder="Выберите тип трансмиссии"
          options={transmissionTypeOptions}
        />

        <NumberFormField 
          name="transmission.gears" 
          label="Количество передач" 
          placeholder="7" 
        />

        <SelectFormField 
          name="drivetrain" 
          label="Привод" 
          placeholder="Выберите тип привода"
          options={drivetrainOptions}
        />
      </div>
    </div>
  );
};

export default CarFormTransmission;
