
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

export interface BrandFilterProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
}

export const BrandFilter = ({ filter, setFilter }: BrandFilterProps) => {
  const { getUniqueValues } = useCars();
  const brands = getUniqueValues("brand");
  
  return (
    <AccordionItem value="brand" className="border-b border-auto-gray-200">
      <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
        Марка
      </AccordionTrigger>
      <AccordionContent>
        <Select
          value={filter.brand || ""}
          onValueChange={(value) => {
            if (value === "all") {
              const newFilter = { ...filter };
              delete newFilter.brand;
              setFilter(newFilter);
            } else {
              setFilter({ ...filter, brand: value });
            }
          }}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Все марки" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все марки</SelectItem>
            {brands.sort().map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AccordionContent>
    </AccordionItem>
  );
};
