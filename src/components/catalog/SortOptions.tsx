
import React, { useState } from "react";
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
  
  // Функция для предотвращения всплытия всех событий
  const blockAllEvents = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    e.preventDefault();
    return false;
  };

  return (
    <div 
      className="relative z-[3001] w-full md:w-[240px]"
      onClick={blockAllEvents}
      onMouseDown={blockAllEvents}
      onTouchStart={blockAllEvents}
      onTouchEnd={blockAllEvents}
      data-no-card-click="true"
    >
      {/* Фоновая маска для закрытия выпадающего списка */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-[3000]" 
          onClick={() => setIsOpen(false)}
          data-no-card-click="true"
        />
      )}
      
      <Select 
        value={sortOption} 
        onValueChange={(value) => {
          onSortChange(value);
          setIsOpen(false);
        }}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger 
          className="w-full bg-white relative z-[3001] border-auto-gray-300"
          onClick={blockAllEvents}
          onMouseDown={blockAllEvents}
          onTouchStart={blockAllEvents}
          onTouchEnd={blockAllEvents}
          data-no-card-click="true"
        >
          <SelectValue placeholder="Сортировка" />
        </SelectTrigger>
        
        <SelectContent 
          position="popper" 
          className="z-[3001] bg-white shadow-lg"
          data-no-card-click="true"
        >
          {sortOptions.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              onClick={blockAllEvents}
              onMouseDown={blockAllEvents}
              onTouchStart={blockAllEvents}
              onTouchEnd={blockAllEvents}
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
