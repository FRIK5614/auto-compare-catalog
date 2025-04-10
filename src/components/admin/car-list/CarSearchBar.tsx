
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CarSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CarSearchBar = ({ searchQuery, setSearchQuery }: CarSearchBarProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Поиск по марке или модели..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default CarSearchBar;
