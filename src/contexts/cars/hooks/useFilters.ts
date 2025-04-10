
import { useState, useEffect } from "react";
import { Car, CarFilter } from "@/types/car";
import { applyFilters } from "../filterActions";

export const useFilters = (cars: Car[]) => {
  const [filter, setFilter] = useState<CarFilter>({});
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);

  // Apply filters whenever cars or filter changes
  useEffect(() => {
    const result = applyFilters(cars, filter);
    setFilteredCars(result);
  }, [cars, filter]);

  return {
    filter,
    setFilter,
    filteredCars
  };
};
