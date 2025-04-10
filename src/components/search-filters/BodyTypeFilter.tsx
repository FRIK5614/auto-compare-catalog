
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

export interface BodyTypeFilterProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
}

export const BodyTypeFilter = ({ filter, setFilter }: BodyTypeFilterProps) => {
  const { getUniqueValues } = useCars();
  const bodyTypes = getUniqueValues("bodyType");
  
  return (
    <AccordionItem value="bodyType" className="border-b border-auto-gray-200">
      <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
        Тип кузова
      </AccordionTrigger>
      <AccordionContent>
        <Select
          value={filter.bodyType || ""}
          onValueChange={(value) => {
            if (value === "all") {
              const newFilter = { ...filter };
              delete newFilter.bodyType;
              setFilter(newFilter);
            } else {
              setFilter({ ...filter, bodyType: value });
            }
          }}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Все типы кузова" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы кузова</SelectItem>
            {bodyTypes.sort().map((type) => (
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
