
import { useCars as useGlobalCars } from "../contexts/CarsContext";
import { Car } from "../types/car";

export const useCarsState = () => {
  const {
    cars,
    loading,
    error,
    favorites,
    compareCars,
    orders,
    removeFromFavorites,
    removeFromCompare
  } = useGlobalCars();

  // Derived data
  const favoriteCars = cars.filter(car => favorites.includes(car.id));
  const comparisonCars = compareCars
    .map(id => cars.find(car => car.id === id))
    .filter((car): car is Car => car !== undefined);

  return {
    cars,
    loading,
    error,
    favoriteCars,
    comparisonCars,
    orders,
    removeFromFavorites,
    removeFromCompare
  };
};
