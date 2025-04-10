
import React, { useState, useEffect } from "react";
import { 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCars } from "@/hooks/useCars";
import { CarFilter } from "@/types/car";

export interface YearFilterProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
}

export const YearFilter = ({ filter, setFilter }: YearFilterProps) => {
  const { getYearRange } = useCars();
  const [yearRange, setYearRange] = useState<[number, number]>([1990, new Date().getFullYear()]);
  
  useEffect(() => {
    const { min: minYear, max: maxYear } = getYearRange();
    
    setYearRange([
      filter.minYear || minYear,
      filter.maxYear || maxYear
    ]);
  }, [filter, getYearRange]);
  
  const handleYearChange = (value: [number, number]) => {
    setYearRange(value);
    
    setFilter({
      ...filter,
      minYear: value[0],
      maxYear: value[1]
    });
  };
  
  return (
    <AccordionItem value="year" className="border-b border-auto-gray-200">
      <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
        Год выпуска
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <Label htmlFor="minYear" className="text-sm text-auto-gray-600">
                От
              </Label>
              <Input
                id="minYear"
                type="number"
                value={yearRange[0]}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    const newYearRange: [number, number] = [value, yearRange[1]];
                    setYearRange(newYearRange);
                    handleYearChange(newYearRange);
                  }
                }}
                className="mt-1"
              />
            </div>
            <div className="flex-1 ml-4">
              <Label htmlFor="maxYear" className="text-sm text-auto-gray-600">
                До
              </Label>
              <Input
                id="maxYear"
                type="number"
                value={yearRange[1]}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    const newYearRange: [number, number] = [yearRange[0], value];
                    setYearRange(newYearRange);
                    handleYearChange(newYearRange);
                  }
                }}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
