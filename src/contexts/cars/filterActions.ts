
import { Car } from "@/types/car";
import { FilterOptions } from "./types";

// Apply filters to cars
export const applyFilters = (cars: Car[], filter: FilterOptions): Car[] => {
  let result = [...cars];

  // Handle brands filter as an array
  if (filter.brands && filter.brands.length > 0) {
    result = result.filter(car => filter.brands?.includes(car.brand));
  }

  if (filter.models && filter.models.length > 0) {
    result = result.filter(car => filter.models?.includes(car.model));
  }

  if (filter.bodyTypes && filter.bodyTypes.length > 0) {
    result = result.filter(car => filter.bodyTypes?.includes(car.bodyType));
  }

  if (filter.priceRange) {
    result = result.filter(
      car => 
        car.price.base >= (filter.priceRange?.min || 0) && 
        car.price.base <= (filter.priceRange?.max || Infinity)
    );
  }

  if (filter.yearRange) {
    result = result.filter(
      car => 
        car.year >= (filter.yearRange?.min || 0) && 
        car.year <= (filter.yearRange?.max || Infinity)
    );
  }

  if (filter.fuelTypes && filter.fuelTypes.length > 0) {
    result = result.filter(car => filter.fuelTypes?.includes(car.engine.fuelType));
  }

  if (filter.transmissionTypes && filter.transmissionTypes.length > 0) {
    result = result.filter(car => filter.transmissionTypes?.includes(car.transmission.type));
  }

  if (filter.isNew !== undefined) {
    result = result.filter(car => car.isNew === filter.isNew);
  }
  
  if (filter.country) {
    result = result.filter(car => car.country === filter.country);
  }

  // Legacy support for older filter properties
  // Handle single brand filter (legacy support)
  if (filter.brand) {
    result = result.filter(car => car.brand === filter.brand);
  }

  if (filter.bodyType) {
    result = result.filter(car => car.bodyType === filter.bodyType);
  }

  if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
    result = result.filter(car => {
      const carPrice = car.price.discount ? car.price.base - car.price.discount : car.price.base;
      return (filter.minPrice === undefined || carPrice >= filter.minPrice) && 
             (filter.maxPrice === undefined || carPrice <= filter.maxPrice);
    });
  }

  if (filter.minYear !== undefined || filter.maxYear !== undefined) {
    result = result.filter(car => 
      (filter.minYear === undefined || car.year >= filter.minYear) && 
      (filter.maxYear === undefined || car.year <= filter.maxYear)
    );
  }

  if (filter.fuelType) {
    result = result.filter(car => car.engine.fuelType === filter.fuelType);
  }

  if (filter.transmissionType) {
    if (Array.isArray(filter.transmissionType)) {
      result = result.filter(car => 
        (filter.transmissionType as string[]).includes(car.transmission.type)
      );
    } else {
      result = result.filter(car => car.transmission.type === filter.transmissionType);
    }
  }

  if (filter.onlyNew) {
    result = result.filter(car => car.isNew === true);
  }

  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    result = result.filter(car => 
      car.brand.toLowerCase().includes(searchLower) || 
      car.model.toLowerCase().includes(searchLower) ||
      `${car.brand} ${car.model}`.toLowerCase().includes(searchLower)
    );
  }

  if (filter.discount) {
    result = result.filter(car => car.price.discount && car.price.discount > 0);
  }

  return result;
};
