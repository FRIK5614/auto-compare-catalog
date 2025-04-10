
import React, { useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCars } from "@/hooks/useCars";
import CarImageGallery from "./CarImageGallery";
import CarBreadcrumbs from "./CarBreadcrumbs";
import CarTitle from "./CarTitle";
import CarTabs from "./CarTabs";
import CarDetailsSidebar from "./CarDetailsSidebar";
import CarNavigation from "@/components/CarNavigation";

const CarDetailsContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getCarById, 
    cars, 
    toggleFavorite, 
    toggleCompare, 
    isFavorite, 
    isInCompare, 
    viewCar 
  } = useCars();
  
  const car = getCarById(id || "");
  const viewRegistered = useRef(false);
  
  useEffect(() => {
    if (car && !viewRegistered.current) {
      viewCar(car.id);
      viewRegistered.current = true;
    }
  }, [car, viewCar]);
  
  if (!car) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Автомобиль не найден</h2>
          <p className="mb-6 text-auto-gray-600">
            К сожалению, информация об этом автомобиле отсутствует в нашей базе данных.
          </p>
          <Button asChild>
            <Link to="/">Вернуться в каталог</Link>
          </Button>
        </div>
      </div>
    );
  }

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
            <CarImageGallery images={car.images} isNew={car.isNew} />
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
        
        <div className="mt-8">
          <CarNavigation currentCarId={car.id} className="mb-4" />
        </div>
      </div>
    </>
  );
};

export default CarDetailsContent;
