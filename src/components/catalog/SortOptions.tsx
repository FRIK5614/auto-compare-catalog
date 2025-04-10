
import React from "react";
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
  // Create type-specific event handlers
  const handleMouseEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleTouchEvent = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div 
      onClick={handleMouseEvent}
      onMouseDown={handleMouseEvent}
      onMouseUp={handleMouseEvent}
      onTouchStart={handleTouchEvent}
      onTouchEnd={handleTouchEvent}
      className="relative z-50"
    >
      <Select 
        value={sortOption} 
        onValueChange={onSortChange}
      >
        <SelectTrigger 
          className="w-[200px]"
          onClick={handleMouseEvent}
          onMouseDown={handleMouseEvent}
          onTouchStart={handleTouchEvent}
          onPointerDown={handleMouseEvent}
        >
          <SelectValue placeholder="Сортировка" />
        </SelectTrigger>
        <SelectContent 
          onMouseDown={handleMouseEvent}
          onClick={handleMouseEvent}
          onTouchStart={handleTouchEvent}
          onTouchEnd={handleTouchEvent}
          onPointerDown={handleMouseEvent}
          position="popper"
          className="z-50"
        >
          {sortOptions.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              onMouseDown={handleMouseEvent}
              onClick={handleMouseEvent}
              onTouchStart={handleTouchEvent}
              onTouchEnd={handleTouchEvent}
              onPointerDown={handleMouseEvent}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
