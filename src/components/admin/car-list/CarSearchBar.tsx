
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CarSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const CarSearchBar: React.FC<CarSearchBarProps> = ({ 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Поиск по марке или модели..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};
