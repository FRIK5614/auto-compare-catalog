
import { useState, useEffect } from "react";
import { useCars } from "@/hooks/useCars";
import { CarFilter } from "@/types/car";

export const useSearchFilters = () => {
  const { 
    filter, 
    setFilter, 
    getUniqueValues, 
    getPriceRange, 
    getYearRange, 
    filteredCars,
    cars,
    loading,
    reloadCars
  } = useCars();

  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableBodyTypes, setAvailableBodyTypes] = useState<string[]>([]);
  const [availableTransmissionTypes, setAvailableTransmissionTypes] = useState<string[]>([]);
  const [availableFuelTypes, setAvailableFuelTypes] = useState<string[]>([]);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [yearRange, setYearRange] = useState({ min: 2000, max: new Date().getFullYear() });

  // Load all available options
  useEffect(() => {
    if (cars.length > 0 && !loading) {
      setAvailableBrands(getUniqueValues("brand") as string[]);
      setAvailableBodyTypes(getUniqueValues("bodyType") as string[]);
      
      // Extract complex nested values
      const transmissions = getUniqueValues("transmission");
      const transmissionTypes = transmissions
        .map(transmission => {
          if (typeof transmission === 'object' && transmission && 'type' in transmission) {
            return (transmission as any).type;
          }
          return null;
        })
        .filter(Boolean) as string[];
      setAvailableTransmissionTypes(Array.from(new Set(transmissionTypes)));
      
      const engines = getUniqueValues("engine");
      const fuelTypes = engines
        .map(engine => {
          if (typeof engine === 'object' && engine && 'fuelType' in engine) {
            return (engine as any).fuelType;
          }
          return null;
        })
        .filter(Boolean) as string[];
      setAvailableFuelTypes(Array.from(new Set(fuelTypes)));
      
      setAvailableCountries(getUniqueValues("country") as string[]);
      
      setPriceRange(getPriceRange());
      setYearRange(getYearRange());
    }
  }, [cars, loading, getUniqueValues, getPriceRange, getYearRange]);

  // Filter helpers
  const updateFilter = (updates: Partial<CarFilter>) => {
    setFilter({ ...filter, ...updates });
  };

  const clearFilter = () => {
    setFilter({});
  };

  const toggleBooleanFilter = (key: keyof CarFilter) => {
    const currentValue = filter[key] as boolean | undefined;
    updateFilter({ [key]: currentValue ? undefined : true });
  };

  const setSearchTerm = (term: string) => {
    updateFilter({ search: term || undefined });
  };

  const setBrand = (brand: string | null) => {
    if (!brand || brand === "all") {
      const newFilter = { ...filter };
      delete newFilter.brand;
      setFilter(newFilter);
    } else {
      updateFilter({ brand });
    }
  };

  const setBodyType = (bodyType: string | null) => {
    if (!bodyType || bodyType === "all") {
      const newFilter = { ...filter };
      delete newFilter.bodyType;
      setFilter(newFilter);
    } else {
      updateFilter({ bodyType });
    }
  };

  const setTransmissionType = (transmissionType: string | null) => {
    if (!transmissionType || transmissionType === "all") {
      const newFilter = { ...filter };
      delete newFilter.transmissionType;
      setFilter(newFilter);
    } else {
      updateFilter({ transmissionType });
    }
  };

  const setFuelType = (fuelType: string | null) => {
    if (!fuelType || fuelType === "all") {
      const newFilter = { ...filter };
      delete newFilter.fuelType;
      setFilter(newFilter);
    } else {
      updateFilter({ fuelType });
    }
  };

  const setCountry = (country: string | null) => {
    if (!country || country === "all") {
      const newFilter = { ...filter };
      delete newFilter.country;
      setFilter(newFilter);
    } else {
      updateFilter({ country });
    }
  };

  const setPriceRangeFilter = (min: number, max: number) => {
    updateFilter({ minPrice: min, maxPrice: max });
  };

  const setYearRangeFilter = (min: number, max: number) => {
    updateFilter({ minYear: min, maxYear: max });
  };

  const toggleOnlyNew = () => {
    toggleBooleanFilter("onlyNew");
  };

  const toggleDiscount = () => {
    toggleBooleanFilter("discount");
  };

  const setSortBy = (sortOption: CarFilter["sortBy"]) => {
    updateFilter({ sortBy: sortOption });
  };

  return {
    // Original filter state
    filter,
    setFilter,
    filteredCars,
    filteredCount: filteredCars.length,
    loading,
    reloadCars,
    
    // Available options
    availableBrands,
    availableBodyTypes,
    availableTransmissionTypes,
    availableFuelTypes,
    availableCountries,
    priceRange,
    yearRange,
    
    // Helper methods
    updateFilter,
    clearFilter,
    setSearchTerm,
    setBrand,
    setBodyType,
    setTransmissionType,
    setFuelType,
    setCountry,
    setPriceRangeFilter,
    setYearRangeFilter,
    toggleOnlyNew,
    toggleDiscount,
    setSortBy
  };
};
