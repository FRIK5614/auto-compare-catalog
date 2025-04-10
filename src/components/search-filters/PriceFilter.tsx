
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

export interface PriceFilterProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
}

export const PriceFilter = ({ filter, setFilter }: PriceFilterProps) => {
  const { getPriceRange } = useCars();
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  
  useEffect(() => {
    const { min: minPrice, max: maxPrice } = getPriceRange();
    
    setMinPrice(filter.minPrice?.toString() || minPrice.toString());
    setMaxPrice(filter.maxPrice?.toString() || maxPrice.toString());
  }, [filter, getPriceRange]);
  
  const handlePriceChange = (min: string, max: string) => {
    const minVal = parseInt(min);
    const maxVal = parseInt(max);
    
    if (!isNaN(minVal) && !isNaN(maxVal) && minVal <= maxVal) {
      setFilter({
        ...filter,
        minPrice: minVal,
        maxPrice: maxVal
      });
    }
  };
  
  return (
    <AccordionItem value="price" className="border-b border-auto-gray-200">
      <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
        Цена
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minPrice" className="text-sm text-auto-gray-600 mb-1 block">
                От
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setMinPrice(newValue);
                  handlePriceChange(newValue, maxPrice);
                }}
                className="bg-auto-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-sm text-auto-gray-600 mb-1 block">
                До
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="10000000"
                value={maxPrice}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setMaxPrice(newValue);
                  handlePriceChange(minPrice, newValue);
                }}
                className="bg-auto-gray-50"
              />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
