import React, { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car } from "@/types/car";
import { ChevronDown } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleOptionSelect = (value: string) => {
    onSortChange(value);
    setOpen(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full md:w-[240px]"
      data-no-card-click="true"
      style={{ zIndex: 9999 }}
    >
      <button
        onClick={handleToggle}
        className="flex h-10 w-full items-center justify-between rounded-md border border-auto-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        data-no-card-click="true"
        style={{ position: 'relative', zIndex: 9999 }}
      >
        <span className="truncate">
          {sortOptions.find(opt => opt.value === sortOption)?.label || "Сортировка"}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {open && (
        <div 
          className="fixed inset-0 bg-black/10" 
          style={{ zIndex: 9998 }}
          onClick={() => setOpen(false)}
          data-no-card-click="true"
        />
      )}

      {open && (
        <div 
          className="absolute z-[9999] mt-1 w-full rounded-md border border-gray-200 bg-white p-1 shadow-lg"
          data-no-card-click="true"
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 ${
                sortOption === option.value ? "bg-gray-100 font-medium" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleOptionSelect(option.value);
              }}
              data-no-card-click="true"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
