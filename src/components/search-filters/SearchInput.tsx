
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CarFilter } from "@/types/car";

interface SearchInputProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
}

export const SearchInput = ({ filter, setFilter }: SearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-auto-gray-400 h-4 w-4" />
      <Input
        placeholder="Поиск по марке или модели"
        value={filter.search || ""}
        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        className="pl-9 bg-auto-gray-50 border-auto-gray-200"
      />
    </div>
  );
};
