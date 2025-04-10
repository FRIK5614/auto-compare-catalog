
import { useCars as useGlobalCars } from "../contexts/CarsContext";
import { Car } from "../types/car";

export const useCarFiltering = () => {
  const {
    cars,
    filteredCars,
    filter,
    setFilter
  } = useGlobalCars();
  
  // Create a filter utils object from the useCarFilters hook
  const {
    getMostViewedCars,
    getUniqueValues,
    getPriceRange,
    getYearRange,
    applySorting,
    applyAdvancedFilter
  } = useCarFilters(cars);

  // Apply sorting to filtered cars
  const sortedFilteredCars = applySorting(filteredCars, filter.sortBy);

  return {
    cars,
    filteredCars: sortedFilteredCars,
    filter,
    setFilter,
    // Export utilities
    getMostViewedCars,
    getUniqueValues,
    getPriceRange,
    getYearRange,
    applySorting,
    applyAdvancedFilter
  };
};

// Re-export the useCarFilters hook here to avoid circular dependencies
function useCarFilters(cars: Car[]) {
  // Helper functions (kept from the original useCarFilters)
  const getMostViewedCars = (limit = 4) => {
    return [...cars]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit);
  };

  const getUniqueValues = (field: keyof Car) => {
    const values = cars.map(car => car[field]);
    return [...new Set(values)].filter(Boolean);
  };

  const getPriceRange = () => {
    if (cars.length === 0) return { min: 0, max: 10000000 };
    
    let min = Infinity;
    let max = 0;
    
    cars.forEach(car => {
      const price = car.price.base;
      min = Math.min(min, price);
      max = Math.max(max, price);
    });
    
    return { min, max };
  };

  const getYearRange = () => {
    if (cars.length === 0) return { min: 2000, max: new Date().getFullYear() };
    
    let min = Infinity;
    let max = 0;
    
    cars.forEach(car => {
      min = Math.min(min, car.year);
      max = Math.max(max, car.year);
    });
    
    return { min, max };
  };

  const applySorting = (cars: Car[], sortBy?: string) => {
    if (!sortBy) return cars;
    
    return [...cars].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price.base - b.price.base;
        case 'price-desc':
          return b.price.base - a.price.base;
        case 'year-asc':
          return a.year - b.year;
        case 'year-desc':
          return b.year - a.year;
        case 'popular':
          return (b.viewCount || 0) - (a.viewCount || 0);
        default:
          return 0;
      }
    });
  };

  const applyAdvancedFilter = (filterParams: any) => {
    return cars.filter(car => {
      // Implement advanced filtering logic here
      return true;
    });
  };

  return {
    getMostViewedCars,
    getUniqueValues,
    getPriceRange,
    getYearRange,
    applySorting,
    applyAdvancedFilter
  };
}
