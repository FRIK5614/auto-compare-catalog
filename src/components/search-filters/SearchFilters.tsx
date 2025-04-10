
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

const SearchFilters = () => {
  const navigate = useNavigate();
  const { filter, setFilter, getUniqueValues, getPriceRange, getYearRange } = useCars();

  const resetFilters = useCallback(() => {
    setFilter({});
  }, [setFilter]);

  const handleSearch = useCallback(() => {
    navigate("/catalog");
  }, [navigate]);

  // Get unique values for filters
  const brands = getUniqueValues('brand');
  const bodyTypes = getUniqueValues('bodyType');
  const fuelTypes = getUniqueValues('engine.fuelType');
  const transmissionTypes = getUniqueValues('transmission.type');
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
          brands={brands}
        />
        
        <BodyTypeFilter 
          filter={filter} 
          setFilter={setFilter} 
          bodyTypes={bodyTypes}
        />
        
        <PriceFilter 
          filter={filter} 
          setFilter={setFilter} 
          priceRange={priceRange}
        />
        
        <YearFilter 
          filter={filter} 
          setFilter={setFilter} 
          yearRange={yearRange}
        />
        
        <FuelTypeFilter 
          filter={filter} 
          setFilter={setFilter} 
          fuelTypes={fuelTypes}
        />
        
        <TransmissionFilter 
          filter={filter} 
          setFilter={setFilter} 
          transmissionTypes={transmissionTypes}
        />
        
        <CountryFilter 
          filter={filter} 
          setFilter={setFilter} 
          countries={countries}
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
