
import { useCars as useGlobalCars } from "../contexts/CarsContext";
import { Car } from "../types/car";
import { useEffect } from "react";

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

  // Reload cars on mount
  useEffect(() => {
    reloadCars();
  }, [reloadCars]);

  // Enhanced version of getCarById with logging for debugging
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
