
import { Car, CarFilter } from "@/types/car";

// Apply filters to cars
export const applyFilters = (cars: Car[], filter: CarFilter): Car[] => {
  let result = [...cars];

  if (filter.brands && filter.brands.length > 0) {
    result = result.filter(car => filter.brands?.includes(car.brand));
  }

  if (filter.models && filter.models.length > 0) {
    result = result.filter(car => filter.models?.includes(car.model));
  }

  if (filter.years && filter.years.length > 0) {
    result = result.filter(car => filter.years?.includes(car.year));
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

  if (filter.engineTypes && filter.engineTypes.length > 0) {
    result = result.filter(car => filter.engineTypes?.includes(car.engine.type));
  }

  if (filter.drivetrains && filter.drivetrains.length > 0) {
    result = result.filter(car => filter.drivetrains?.includes(car.drivetrain));
  }

  if (filter.isNew !== undefined) {
    result = result.filter(car => car.isNew === filter.isNew);
  }
  
  if (filter.countries && filter.countries.length > 0) {
    result = result.filter(car => car.country && filter.countries?.includes(car.country));
  }

  // Handle simple filters
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

  if (filter.country) {
    result = result.filter(car => car.country === filter.country);
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
