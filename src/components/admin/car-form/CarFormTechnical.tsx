
import React from "react";
import { Car } from "@/types/car";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CarFormEngine from "./CarFormEngine";
import CarFormTransmission from "./CarFormTransmission";

interface CarFormTechnicalProps {
  car: Car;
}

const CarFormTechnical = ({ car }: CarFormTechnicalProps) => {
  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>Технические характеристики</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Двигатель */}
        <CarFormEngine car={car} />

        <Separator />

        {/* Трансмиссия */}
        <CarFormTransmission car={car} />
      </CardContent>
    </Card>
  );
};

export default CarFormTechnical;
