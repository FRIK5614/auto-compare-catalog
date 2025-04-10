
import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { BrandFilter } from "./BrandFilter";
import { BodyTypeFilter } from "./BodyTypeFilter";
import { PriceFilter } from "./PriceFilter";
import { YearFilter } from "./YearFilter";
import { TransmissionFilter } from "./TransmissionFilter";
import { FuelTypeFilter } from "./FuelTypeFilter";
import { CountryFilter } from "./CountryFilter";
import { ExtraFilter } from "./ExtraFilter";
import { SearchInput } from "./SearchInput";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import { useCars } from "@/hooks/useCars";
import { CarFilter } from "@/types/car";

export interface SearchFiltersProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
  closeModal?: () => void;
  isInModal?: boolean;
}

export const SearchFilters = ({ filter, setFilter, closeModal, isInModal }: SearchFiltersProps) => {
  const { reloadCars, loading } = useCars();

  const resetFilters = () => {
    setFilter({});
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-auto-gray-200">
      <div className="p-4 border-b border-auto-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-auto-gray-900">Фильтры</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFilters}
              className="h-8 text-auto-gray-700 text-xs flex items-center"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Сбросить
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={reloadCars}
              disabled={loading}
              className="h-8 text-auto-gray-700 text-xs flex items-center"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>
        </div>
        <SearchInput filter={filter} setFilter={setFilter} />
      </div>

      <Accordion type="multiple" defaultValue={["brand", "price"]} className="px-4 py-2">
        <BrandFilter filter={filter} setFilter={setFilter} />
        <BodyTypeFilter filter={filter} setFilter={setFilter} />
        <PriceFilter filter={filter} setFilter={setFilter} />
        <YearFilter filter={filter} setFilter={setFilter} />
        <TransmissionFilter filter={filter} setFilter={setFilter} />
        <FuelTypeFilter filter={filter} setFilter={setFilter} />
        <CountryFilter filter={filter} setFilter={setFilter} />
        <ExtraFilter filter={filter} setFilter={setFilter} />
      </Accordion>
    </div>
  );
};

export default SearchFilters;
