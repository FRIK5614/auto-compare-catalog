
import React from "react";
import { Car } from "@/types/car";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CarFormEngine from "./CarFormEngine";
import CarFormTransmission from "./CarFormTransmission";

interface CarFormTechnicalProps {
  car: Car;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCar: React.Dispatch<React.SetStateAction<Car | null>>;
  handleSelectChange: (name: string, value: string) => void;
}

const CarFormTechnical = ({
  car,
  handleInputChange,
  handleNumberInputChange,
  setCar,
  handleSelectChange,
}: CarFormTechnicalProps) => {
  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>Технические характеристики</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Двигатель */}
        <CarFormEngine
          car={car}
          handleInputChange={handleInputChange}
          handleNumberInputChange={handleNumberInputChange}
          setCar={setCar}
        />

        <Separator />

        {/* Трансмиссия */}
        <CarFormTransmission
          car={car}
          handleNumberInputChange={handleNumberInputChange}
          setCar={setCar}
          handleSelectChange={handleSelectChange}
        />
      </CardContent>
    </Card>
  );
};

export default CarFormTechnical;
