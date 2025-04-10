
import { useCars as useGlobalCars } from "../contexts/CarsContext";
import { Car } from "@/types/car";
import { useEffect, useRef } from "react";

export const useCarDetails = () => {
  const {
    cars,
    getCarById,
    reloadCars,
    viewCar,
    deleteCar,
    updateCar,
    addCar,
    uploadCarImage
  } = useGlobalCars();
  
  // Используем ref, чтобы отслеживать первоначальную загрузку
  const initialLoadDone = useRef(false);
  const initialLoadStarted = useRef(false);

  // Загружаем автомобили только при первом монтировании
  useEffect(() => {
    if (!initialLoadDone.current && !initialLoadStarted.current && cars.length === 0) {
      initialLoadStarted.current = true;
      reloadCars().then(() => {
        initialLoadDone.current = true;
      });
    } else if (cars.length > 0) {
      initialLoadDone.current = true;
    }
  }, [cars.length, reloadCars]);

  // Улучшенная версия getCarById с логированием для отладки
  const enhancedGetCarById = (id: string) => {
    console.log('Looking for car with ID:', id);
    console.log('Available cars:', cars.length);
    const car = cars.find(car => car.id === id);
    console.log('Found car:', car ? 'Yes' : 'No');
    return car;
  };

  return {
    cars,
    getCarById: enhancedGetCarById,
    viewCar,
    deleteCar,
    updateCar,
    addCar,
    uploadCarImage,
    reloadCars
  };
};
