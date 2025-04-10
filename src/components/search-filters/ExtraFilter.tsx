
import React from "react";
import { 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CarFilter } from "@/types/car";

interface ExtraFilterProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
}

export const ExtraFilter = ({ filter, setFilter }: ExtraFilterProps) => {
  return (
    <AccordionItem value="extra" className="border-b-0">
      <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
        Дополнительно
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="onlyNew" 
              checked={filter.onlyNew || false}
              onCheckedChange={(checked) => 
                setFilter({ ...filter, onlyNew: checked ? true : undefined })
              }
            />
            <Label htmlFor="onlyNew" className="cursor-pointer">
              Только новые
            </Label>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
