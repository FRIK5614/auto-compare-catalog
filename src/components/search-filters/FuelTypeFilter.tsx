
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

interface FuelTypeFilterProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
}

export const FuelTypeFilter = ({ filter, setFilter }: FuelTypeFilterProps) => {
  const { getUniqueValues } = useCars();
  const fuelTypes = getUniqueValues("engine").map(e => e?.fuelType).filter(Boolean) as string[];
  
  return (
    <AccordionItem value="fuelType" className="border-b border-auto-gray-200">
      <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
        Тип топлива
      </AccordionTrigger>
      <AccordionContent>
        <Select
          value={filter.fuelType || ""}
          onValueChange={(value) => {
            if (value === "all") {
              const newFilter = { ...filter };
              delete newFilter.fuelType;
              setFilter(newFilter);
            } else {
              setFilter({ ...filter, fuelType: value });
            }
          }}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Все типы топлива" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы топлива</SelectItem>
            {Array.from(new Set(fuelTypes)).sort().map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AccordionContent>
    </AccordionItem>
  );
};
