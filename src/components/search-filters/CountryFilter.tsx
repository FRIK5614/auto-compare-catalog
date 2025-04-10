
import React from "react";
import { 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CarFilter } from "@/types/car";

export interface CountryFilterProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
}

export const CountryFilter = ({ filter, setFilter }: CountryFilterProps) => {
  const handleCountryChange = (value: string) => {
    setFilter({
      ...filter,
      country: value
    });
  };
  
  return (
    <AccordionItem value="country" className="border-b border-auto-gray-200">
      <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
        Экспорт из страны
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <RadioGroup
            value={filter.country || ""}
            onValueChange={handleCountryChange}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="country-all" />
              <Label htmlFor="country-all" className="cursor-pointer">
                Все страны
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="japan" id="country-japan" />
              <Label htmlFor="country-japan" className="cursor-pointer">
                Япония
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="korea" id="country-korea" />
              <Label htmlFor="country-korea" className="cursor-pointer">
                Корея
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="germany" id="country-germany" />
              <Label htmlFor="country-germany" className="cursor-pointer">
                Германия
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="usa" id="country-usa" />
              <Label htmlFor="country-usa" className="cursor-pointer">
                США
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="china" id="country-china" />
              <Label htmlFor="country-china" className="cursor-pointer">
                Китай
              </Label>
            </div>
          </RadioGroup>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
