
import React from "react";
import { 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCars } from "@/hooks/useCars";
import { CarFilter } from "@/types/car";

export interface BrandFilterProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
}

export const BrandFilter = ({ filter, setFilter }: BrandFilterProps) => {
  const { getUniqueValues } = useCars();
  const brands = getUniqueValues("brand") as string[];
  
  const handleBrandChange = (brand: string, checked: boolean) => {
    const currentBrands = filter.brands || [];
    
    if (checked) {
      // Add the brand to the filter
      const newBrands = [...currentBrands, brand];
      setFilter({ ...filter, brands: newBrands });
    } else {
      // Remove the brand from the filter
      const newBrands = currentBrands.filter(b => b !== brand);
      
      // If no brands left, remove the brands property
      if (newBrands.length === 0) {
        const newFilter = { ...filter };
        delete newFilter.brands;
        setFilter(newFilter);
      } else {
        setFilter({ ...filter, brands: newBrands });
      }
    }
  };
  
  return (
    <AccordionItem value="brand" className="border-b border-auto-gray-200">
      <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
        Марка
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
          {brands.sort().map((brand) => {
            const isChecked = filter.brands?.includes(brand) || false;
            
            return (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox 
                  id={`brand-${brand}`} 
                  checked={isChecked}
                  onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                />
                <Label 
                  htmlFor={`brand-${brand}`}
                  className="text-sm cursor-pointer"
                >
                  {brand}
                </Label>
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
