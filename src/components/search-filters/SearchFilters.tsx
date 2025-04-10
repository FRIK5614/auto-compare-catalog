
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { useCars } from "@/hooks/useCars";
import { SearchInput } from "./SearchInput";
import { BrandFilter } from "./BrandFilter";
import { BodyTypeFilter } from "./BodyTypeFilter";
import { PriceFilter } from "./PriceFilter";
import { YearFilter } from "./YearFilter";
import { FuelTypeFilter } from "./FuelTypeFilter";
import { TransmissionFilter } from "./TransmissionFilter";
import { CountryFilter } from "./CountryFilter";
import { ExtraFilter } from "./ExtraFilter";
import { CarFilter } from "@/types/car";

interface SearchFiltersProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
  closeModal?: () => void;
  isInModal?: boolean;
}

const SearchFilters = ({ filter, setFilter, closeModal, isInModal }: SearchFiltersProps) => {
  const navigate = useNavigate();
  const { getUniqueValues, getPriceRange, getYearRange } = useCars();

  const resetFilters = useCallback(() => {
    setFilter({});
  }, [setFilter]);

  const handleSearch = useCallback(() => {
    navigate("/catalog");
  }, [navigate]);

  // Get unique values for filters
  const brands = getUniqueValues('brand');
  const bodyTypes = getUniqueValues('bodyType');
  const fuelTypes = getUniqueValues('engine').map(e => e?.fuelType).filter(Boolean) as string[];
  const transmissionTypes = getUniqueValues('transmission').map(t => t?.type).filter(Boolean) as string[];
  const countries = getUniqueValues('country');
  
  // Get min/max price and year ranges
  const priceRange = getPriceRange();
  const yearRange = getYearRange();

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <SearchInput filter={filter} setFilter={setFilter} />
      
      <Accordion type="multiple" defaultValue={['brand']} className="space-y-2">
        <BrandFilter 
          filter={filter} 
          setFilter={setFilter} 
        />
        
        <BodyTypeFilter 
          filter={filter} 
          setFilter={setFilter} 
        />
        
        <PriceFilter 
          filter={filter} 
          setFilter={setFilter} 
        />
        
        <YearFilter 
          filter={filter} 
          setFilter={setFilter} 
        />
        
        <FuelTypeFilter 
          filter={filter} 
          setFilter={setFilter} 
        />
        
        <TransmissionFilter 
          filter={filter} 
          setFilter={setFilter} 
        />
        
        <CountryFilter 
          filter={filter} 
          setFilter={setFilter} 
        />
        
        <ExtraFilter 
          filter={filter}
          setFilter={setFilter}
        />
      </Accordion>
      
      <div className="flex space-x-2">
        <Button 
          className="w-full" 
          onClick={handleSearch}
        >
          Поиск
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={resetFilters}
        >
          Сбросить
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
