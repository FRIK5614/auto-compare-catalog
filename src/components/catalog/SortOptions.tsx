
import React, { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car } from "@/types/car";

export type SortOption = {
  label: string;
  value: string;
  sortFn: (a: Car, b: Car) => number;
};

export const sortOptions: SortOption[] = [
  { 
    label: "По умолчанию", 
    value: "default", 
    sortFn: (a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model)
  },
  { 
    label: "По цене (возрастание)", 
    value: "price_asc", 
    sortFn: (a, b) => a.price.base - b.price.base
  },
  { 
    label: "По цене (убывание)", 
    value: "price_desc", 
    sortFn: (a, b) => b.price.base - a.price.base
  },
  { 
    label: "По году (новые)", 
    value: "year_desc", 
    sortFn: (a, b) => b.year - a.year
  },
  { 
    label: "По году (старые)", 
    value: "year_asc", 
    sortFn: (a, b) => a.year - b.year
  },
  { 
    label: "По названию (А-Я)", 
    value: "name_asc", 
    sortFn: (a, b) => (a.brand + a.model).localeCompare(b.brand + b.model)
  },
  { 
    label: "По названию (Я-А)", 
    value: "name_desc", 
    sortFn: (a, b) => (b.brand + b.model).localeCompare(a.brand + a.model)
  }
];

export const mapSortOptionFromFilter = (filterSort?: string): string => {
  switch (filterSort) {
    case "priceAsc": return "price_asc";
    case "priceDesc": return "price_desc";
    case "yearDesc": return "year_desc";
    case "yearAsc": return "year_asc";
    case "nameAsc": return "name_asc";
    case "nameDesc": return "name_desc";
    default: return "default";
  }
};

export const mapSortOptionToFilter = (sortOption: string): "popularity" | "priceAsc" | "priceDesc" | "yearDesc" | "yearAsc" | "nameAsc" | "nameDesc" => {
  switch (sortOption) {
    case "price_asc": return "priceAsc";
    case "price_desc": return "priceDesc";
    case "year_desc": return "yearDesc";
    case "year_asc": return "yearAsc";
    case "name_asc": return "nameAsc";
    case "name_desc": return "nameDesc";
    default: return "popularity";
  }
};

interface SortOptionsProps {
  sortOption: string;
  onSortChange: (value: string) => void;
}

export const SortOptions: React.FC<SortOptionsProps> = ({ sortOption, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('select-dropdown-open');
    } else {
      document.body.classList.remove('select-dropdown-open');
    }
    
    return () => {
      document.body.classList.remove('select-dropdown-open');
    };
  }, [isOpen]);

  // Simplified event blocking - only applied to content, not the trigger
  const blockEvents = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleSelectItem = (value: string) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative z-[3000] w-full md:w-[240px] select-dropdown"
      data-no-card-click="true"
    >
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-[2999]" 
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
          data-no-card-click="true"
        />
      )}
      
      <Select 
        value={sortOption} 
        onValueChange={handleSelectItem}
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Сортировка" />
        </SelectTrigger>
        <SelectContent 
          position="popper" 
          className="z-[3000] bg-white"
          onPointerDownOutside={(e) => {
            e.preventDefault();
            blockEvents(e);
          }}
          onClick={blockEvents}
        >
          {sortOptions.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              data-no-card-click="true"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
