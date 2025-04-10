
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
import { RefreshCw } from "lucide-react";
import { useCars } from "@/hooks/useCars";
import { CarFilter } from "@/types/car";

export interface SearchFiltersProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
  closeModal?: () => void;
  isInModal?: boolean;
}

export const SearchFilters = ({
  filter,
  setFilter,
  closeModal,
  isInModal
}: SearchFiltersProps) => {
  const {
    reloadCars,
    loading
  } = useCars();

  const applyFilters = () => {
    reloadCars();
    if (isInModal && closeModal) {
      closeModal();
    }
  };

  return (
    <div className="w-full rounded-lg bg-white/[0.34]">
      <div className="mb-4">
        <SearchInput filter={filter} setFilter={setFilter} />
      </div>

      <Accordion type="multiple" defaultValue={["brand", "price"]} className="py-2">
        <BrandFilter filter={filter} setFilter={setFilter} />
        <BodyTypeFilter filter={filter} setFilter={setFilter} />
        <PriceFilter filter={filter} setFilter={setFilter} />
        <YearFilter filter={filter} setFilter={setFilter} />
        <TransmissionFilter filter={filter} setFilter={setFilter} />
        <FuelTypeFilter filter={filter} setFilter={setFilter} />
        <CountryFilter filter={filter} setFilter={setFilter} />
        <ExtraFilter filter={filter} setFilter={setFilter} />
      </Accordion>

      {!isInModal && (
        <div className="p-4 sticky bottom-0 bg-white border-t border-auto-gray-200">
          <div className="flex flex-col space-y-3 items-center">
            <Button 
              variant="blue" 
              size="default" 
              onClick={applyFilters} 
              disabled={loading} 
              className="w-full max-w-xs flex items-center justify-center"
            >
              {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
              Применить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
