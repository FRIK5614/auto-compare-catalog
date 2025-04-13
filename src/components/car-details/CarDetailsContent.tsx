
import React, { useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCars } from "@/hooks/useCars";
import { useToast } from "@/hooks/use-toast";
import CarImageGallery from "./CarImageGallery";
import CarBreadcrumbs from "./CarBreadcrumbs";
import CarTitle from "./CarTitle";
import CarTabs from "./CarTabs";
import CarDetailsSidebar from "./CarDetailsSidebar";
import CarNavigation from "@/components/CarNavigation";
import ErrorState from "@/components/ErrorState";

const CarDetailsContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    getCarById, 
    cars, 
    toggleFavorite, 
    toggleCompare, 
    isFavorite, 
    isInCompare, 
    viewCar,
    loading,
    error,
    reloadCars
  } = useCars();
  
  // Пробуем загрузить данные при первом рендере, если массив автомобилей пуст
  useEffect(() => {
    if (cars.length === 0 && !loading && !error) {
      reloadCars();
    }
  }, [cars.length, loading, error, reloadCars]);
  
  const car = id ? getCarById(id) : null;
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
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Загрузка данных...</h2>
          <p className="mb-6 text-auto-gray-600">
            Пожалуйста, подождите, идет загрузка данных из базы.
          </p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <ErrorState 
            message={`Ошибка загрузки данных: ${error}`} 
            onRetry={reloadCars}
          />
          <div className="mt-4">
            <Button asChild>
              <Link to="/">Вернуться в каталог</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Показываем сообщение о загрузке, если массив автомобилей пуст
  if (cars.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Загрузка автомобилей</h2>
          <p className="mb-6 text-auto-gray-600">
            Пожалуйста, подождите, идет загрузка данных из базы.
          </p>
          <Button onClick={reloadCars}>Обновить</Button>
        </div>
      </div>
    );
  }
  
  if (!car) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Автомобиль не найден</h2>
          <p className="mb-6 text-auto-gray-600">
            К сожалению, информация об этом автомобиле отсутствует в нашей базе данных.
          </p>
          <p className="mb-6 text-auto-gray-600">
            Запрошенный ID: {id}
          </p>
          <Button asChild className="mr-2">
            <Link to="/">Вернуться в каталог</Link>
          </Button>
          <Button variant="outline" onClick={() => reloadCars()}>
            Обновить данные
          </Button>
        </div>
      </div>
    );
  }

  // Ensure car.images is always an array
  const safeImages = car.images && Array.isArray(car.images) ? car.images : [];

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
            {/* Pass the safe images array to the gallery */}
            <CarImageGallery 
              images={safeImages} 
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
