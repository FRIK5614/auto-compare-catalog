
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

interface TransmissionFilterProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
}

export const TransmissionFilter = ({ filter, setFilter }: TransmissionFilterProps) => {
  const { getUniqueValues } = useCars();
  const transmissionTypes = getUniqueValues("transmission").map(t => t?.type).filter(Boolean) as string[];
  
  return (
    <AccordionItem value="transmission" className="border-b border-auto-gray-200">
      <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
        Коробка передач
      </AccordionTrigger>
      <AccordionContent>
        <Select
          value={filter.transmissionType as string || ""}
          onValueChange={(value) => {
            if (value === "all") {
              const newFilter = { ...filter };
              delete newFilter.transmissionType;
              setFilter(newFilter);
            } else {
              setFilter({ ...filter, transmissionType: value });
            }
          }}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Все типы КПП" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы КПП</SelectItem>
            {Array.from(new Set(transmissionTypes)).sort().map((type) => (
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
