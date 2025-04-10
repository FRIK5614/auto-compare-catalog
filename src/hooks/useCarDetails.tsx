
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
    uploadCarImage,
    loading,
    error
  } = useGlobalCars();
  
  // Используем ref, чтобы отслеживать первоначальную загрузку
  const initialLoadDone = useRef(false);
  const initialLoadStarted = useRef(false);

  // Загружаем автомобили только при первом монтировании
  useEffect(() => {
    if (!initialLoadDone.current && !initialLoadStarted.current && cars.length === 0 && !loading && !error) {
      initialLoadStarted.current = true;
      reloadCars().then(() => {
        initialLoadDone.current = true;
        
        // Логируем информацию о количестве автомобилей после загрузки
        console.log("====== ИНФОРМАЦИЯ О БАЗЕ ДАННЫХ АВТОМОБИЛЕЙ ======");
        console.log(`Всего автомобилей в базе: ${cars.length}`);
        
        // Группируем по брендам для более детального анализа
        const brandCounts = cars.reduce((acc, car) => {
          acc[car.brand] = (acc[car.brand] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        console.log("Распределение по брендам:");
        Object.entries(brandCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .forEach(([brand, count]) => {
            console.log(`- ${brand}: ${count} автомобилей`);
          });
        
        // Группируем по странам
        const countryCounts = cars.reduce((acc, car) => {
          const country = car.country || 'Не указана';
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        console.log("Распределение по странам:");
        Object.entries(countryCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .forEach(([country, count]) => {
            console.log(`- ${country}: ${count} автомобилей`);
          });
        
        console.log("============================================");
      }).catch(err => {
        console.error("Error loading cars:", err);
        initialLoadDone.current = true;
      });
    } else if (cars.length > 0) {
      initialLoadDone.current = true;
    }
  }, [cars.length, reloadCars, loading, error]);

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
    loading,
    error,
    getCarById: enhancedGetCarById,
    viewCar,
    deleteCar,
    updateCar,
    addCar,
    uploadCarImage,
    reloadCars
  };
};
