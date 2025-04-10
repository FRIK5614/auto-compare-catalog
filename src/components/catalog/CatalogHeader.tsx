
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { SortOptions } from "./SortOptions";

interface CatalogHeaderProps {
  count: number;
  loading: boolean;
  isMobile: boolean;
  sortOption: string;
  onSortChange: (value: string) => void;
  onOpenFilterModal: () => void;
}

export const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  count,
  loading,
  isMobile,
  sortOption,
  onSortChange,
  onOpenFilterModal,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-auto-gray-900">Каталог автомобилей</h1>
        {!loading && (
          <p className="text-auto-gray-600 mt-1">
            Найдено {count} автомобилей
          </p>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 w-full sm:w-auto">
        {isMobile && (
          <Button 
            variant="blue" 
            className="flex items-center z-30" 
            onClick={onOpenFilterModal}
          >
            <Filter className="mr-2 h-4 w-4" />
            Фильтры
          </Button>
        )}
        
        <div className="z-30">
          <SortOptions sortOption={sortOption} onSortChange={onSortChange} />
        </div>
      </div>
    </div>
  );
};
