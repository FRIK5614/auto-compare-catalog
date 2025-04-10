
import { useCars as useGlobalCars } from "../contexts/CarsContext";
import { Car } from "../types/car";
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

  // Загружаем автомобили только при первом монтировании
  useEffect(() => {
    if (!initialLoadDone.current) {
      reloadCars();
      initialLoadDone.current = true;
    }
  }, [reloadCars]);

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
