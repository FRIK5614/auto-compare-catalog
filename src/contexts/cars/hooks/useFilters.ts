
import { useState, useEffect } from "react";
import { Car } from "@/types/car";
import { FilterOptions } from "../types";
import { applyFilters } from "../filterActions";

export const useFilters = (cars: Car[]) => {
  const [filter, setFilter] = useState<FilterOptions>({});
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
