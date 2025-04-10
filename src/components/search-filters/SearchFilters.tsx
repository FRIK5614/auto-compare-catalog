
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, X } from "lucide-react";
import { useCars } from "@/hooks/useCars";
import { CarFilter } from "@/types/car";

import { SearchInput } from "./SearchInput";
import { BrandFilter } from "./BrandFilter";
import { PriceFilter } from "./PriceFilter";
import { BodyTypeFilter } from "./BodyTypeFilter";
import { YearFilter } from "./YearFilter";
import { FuelTypeFilter } from "./FuelTypeFilter";
import { TransmissionFilter } from "./TransmissionFilter";
import { CountryFilter } from "./CountryFilter";
import { ExtraFilter } from "./ExtraFilter";

interface SearchFiltersProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
  className?: string;
  closeModal?: () => void;
  isInModal?: boolean;
}

const SearchFilters = ({ filter, setFilter, className, closeModal, isInModal }: SearchFiltersProps) => {
  const { getUniqueValues } = useCars();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Calculate active filters
  useEffect(() => {
    const active = [];
    if (filter.search) active.push("search");
    if (filter.brand) active.push("brand");
    if (filter.bodyType) active.push("bodyType");
    if (filter.minPrice || filter.maxPrice) active.push("price");
    if (filter.minYear || filter.maxYear) active.push("year");
    if (filter.fuelType) active.push("fuelType");
    if (filter.transmissionType) active.push("transmissionType");
    if (filter.country) active.push("country");
    if (filter.onlyNew) active.push("onlyNew");
    setActiveFilters(active);
  }, [filter]);
  
  const resetFilters = () => {
    setFilter({
      search: "",
      sortBy: "popularity",
    });
  };
  
  const applyFilters = () => {
    if (closeModal) {
      closeModal();
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold flex items-center">
            <Filter className="mr-2 h-5 w-5 text-auto-blue-600" />
            Фильтры
            {activeFilters.length > 0 && (
              <Badge className="ml-2 bg-auto-blue-600">{activeFilters.length}</Badge>
            )}
          </h3>
          
          {activeFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-auto-gray-500 hover:text-auto-gray-700"
            >
              Сбросить
              <X className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Separator />
        
        <SearchInput filter={filter} setFilter={setFilter} />
        
        <ScrollArea className="h-[calc(100vh-380px)] pr-4">
          <Accordion type="multiple" defaultValue={["brand", "price", "bodyType"]} className="w-full">
            <BrandFilter filter={filter} setFilter={setFilter} />
            <PriceFilter filter={filter} setFilter={setFilter} />
            <BodyTypeFilter filter={filter} setFilter={setFilter} />
            <YearFilter filter={filter} setFilter={setFilter} />
            <FuelTypeFilter filter={filter} setFilter={setFilter} />
            <TransmissionFilter filter={filter} setFilter={setFilter} />
            <CountryFilter filter={filter} setFilter={setFilter} />
            <ExtraFilter filter={filter} setFilter={setFilter} />
          </Accordion>
        </ScrollArea>
      </div>
      
      {isInModal && closeModal && (
        <div className="p-4 border-t border-auto-gray-200">
          <Button 
            className="w-full"
            variant="blue" 
            onClick={applyFilters}
          >
            Применить фильтры
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
