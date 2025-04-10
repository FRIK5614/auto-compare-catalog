
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CarSpecificationsTab from "./CarSpecificationsTab";
import CarFeaturesTab from "./CarFeaturesTab";
import CarDescriptionTab from "./CarDescriptionTab";
import { Car } from "@/types/car";

interface CarTabsProps {
  car: Car;
}

const CarTabs: React.FC<CarTabsProps> = ({ car }) => {
  return (
    <div className="mt-8">
      <Tabs defaultValue="specs">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="specs">Характеристики</TabsTrigger>
          <TabsTrigger value="features">Комплектация</TabsTrigger>
          <TabsTrigger value="description">Описание</TabsTrigger>
        </TabsList>
        
        <TabsContent value="specs" className="bg-white p-6 rounded-lg shadow-sm mt-4">
          <CarSpecificationsTab car={car} />
        </TabsContent>
        
        <TabsContent value="features" className="bg-white p-6 rounded-lg shadow-sm mt-4">
          <CarFeaturesTab car={car} />
        </TabsContent>
        
        <TabsContent value="description" className="bg-white p-6 rounded-lg shadow-sm mt-4">
          <CarDescriptionTab description={car.description} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarTabs;
