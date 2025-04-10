
import React from "react";
import { 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useCars } from "@/hooks/useCars";
import { CarFilter } from "@/types/car";

export interface CountryFilterProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
}

export const CountryFilter = ({ filter, setFilter }: CountryFilterProps) => {
  const { getUniqueValues } = useCars();
  const countries = getUniqueValues("country");
  
  return (
    <AccordionItem value="country" className="border-b border-auto-gray-200">
      <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
        Страна производства
      </AccordionTrigger>
      <AccordionContent>
        <Select
          value={filter.country || ""}
          onValueChange={(value) => {
            if (value === "all") {
              const newFilter = { ...filter };
              delete newFilter.country;
              setFilter(newFilter);
            } else {
              setFilter({ ...filter, country: value });
            }
          }}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Все страны" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все страны</SelectItem>
            {countries.sort().map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AccordionContent>
    </AccordionItem>
  );
};
