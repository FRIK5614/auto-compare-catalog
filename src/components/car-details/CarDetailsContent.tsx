
import React, { useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCars } from "@/hooks/useCars";
import { useToast } from "@/hooks/use-toast";
import { Car } from "@/types/car"; // Make sure to import Car type
import CarImageGallery from "./CarImageGallery";
import CarBreadcrumbs from "./CarBreadcrumbs";
import CarTitle from "./CarTitle";
import CarTabs from "./CarTabs";
import CarDetailsSidebar from "./CarDetailsSidebar";
import CarNavigation from "@/components/CarNavigation";
import ErrorState from "@/components/ErrorState";

// Define the props interface for CarDetailsContent
interface CarDetailsContentProps {
  car: Car;
}

const CarDetailsContent: React.FC<CarDetailsContentProps> = ({ car }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    toggleFavorite, 
    toggleCompare, 
    isFavorite, 
    isInCompare, 
    viewCar,
  } = useCars();
  
  const viewRegistered = useRef(false);
  
  useEffect(() => {
    if (car && !viewRegistered.current) {
      viewCar(car.id);
      viewRegistered.current = true;
    }

    // Проверка наличия изображений
    if (car && car.images) {
      console.log("CarDetailsContent: Загружено автомобиль с изображениями:", car.images.length);
    }
  }, [car, viewCar]);

  return (
    <>
      <CarBreadcrumbs car={car} />
      <CarTitle 
        car={car}
        isFavorite={isFavorite(car.id)}
        isInCompare={isInCompare(car.id)}
        toggleFavorite={toggleFavorite}
        toggleCompare={toggleCompare}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CarImageGallery 
              images={car.images} 
              isNew={car.isNew} 
            />
            <CarTabs car={car} />
          </div>
          
          <div>
            <CarDetailsSidebar
              car={car}
              isFavorite={isFavorite(car.id)}
              isInCompare={isInCompare(car.id)}
              toggleFavorite={toggleFavorite}
              toggleCompare={toggleCompare}
            />
          </div>
        </div>
        
        <div className="mt-8 overflow-x-hidden">
          <CarNavigation currentCarId={car.id} className="mb-4" />
        </div>
      </div>
    </>
  );
};

export default CarDetailsContent;
