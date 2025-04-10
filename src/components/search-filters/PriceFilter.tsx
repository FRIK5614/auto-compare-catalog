
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
  const priceRange = getPriceRange();
  
  useEffect(() => {
    setMinPrice(filter.minPrice?.toString() || priceRange.min.toString());
    setMaxPrice(filter.maxPrice?.toString() || priceRange.max.toString());
  }, [filter, priceRange]);
  
  const handleMinPriceChange = (value: string) => {
    const minVal = parseInt(value);
    setMinPrice(value);
    
    if (!isNaN(minVal)) {
      const maxVal = filter.maxPrice || parseInt(maxPrice);
      setFilter({
        ...filter,
        minPrice: minVal,
        maxPrice: maxVal > minVal ? maxVal : undefined
      });
    }
  };
  
  const handleMaxPriceChange = (value: string) => {
    const maxVal = parseInt(value);
    setMaxPrice(value);
    
    if (!isNaN(maxVal)) {
      const minVal = filter.minPrice || parseInt(minPrice);
      setFilter({
        ...filter,
        minPrice: minVal < maxVal ? minVal : undefined,
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
                onChange={(e) => handleMinPriceChange(e.target.value)}
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
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                className="bg-auto-gray-50"
              />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
