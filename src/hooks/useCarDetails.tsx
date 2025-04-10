
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
  const initialLoadTimeout = useRef<NodeJS.Timeout | null>(null);

  // Загружаем автомобили только при первом монтировании с защитой от повторных вызовов
  useEffect(() => {
    if (!initialLoadDone.current && !initialLoadStarted.current && cars.length === 0 && !loading && !error) {
      initialLoadStarted.current = true;
      
      // Add a small delay to prevent multiple rapid reload calls
      initialLoadTimeout.current = setTimeout(() => {
        console.log("🔄 Initial car data load from useCarDetails");
        reloadCars().then(() => {
          initialLoadDone.current = true;
          
          // Log info about loaded cars after successful load
          if (cars.length > 0) {
            console.log("====== ИНФОРМАЦИЯ О БАЗЕ ДАННЫХ АВТОМОБИЛЕЙ ======");
            console.log(`Всего автомобилей в базе: ${cars.length}`);
            
            // Group by brands for more detailed analysis
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
            
            // Group by countries
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
          }
        }).catch(err => {
          console.error("Error loading cars:", err);
          initialLoadDone.current = true;
        });
      }, 500);
    } else if (cars.length > 0) {
      initialLoadDone.current = true;
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (initialLoadTimeout.current) {
        clearTimeout(initialLoadTimeout.current);
      }
    };
  }, [cars.length, reloadCars, loading, error]);

  // Улучшенная версия getCarById с поддержкой числовых и UUID идентификаторов
  const enhancedGetCarById = (id: string) => {
    if (!id) return undefined;
    
    console.log('Looking for car with ID:', id);
    console.log('Available cars:', cars.length);
    
    // Пробуем найти по точному совпадению ID (UUID)
    let car = cars.find(car => car.id === id);
    
    // Если не нашли и ID выглядит как число, попробуем найти в массиве автомобилей с индексом
    if (!car && /^\d+$/.test(id)) {
      const index = parseInt(id) - 1; // Преобразуем в индекс массива (0-based)
      if (index >= 0 && index < cars.length) {
        car = cars[index];
      }
    }
    
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
