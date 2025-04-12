
import React from "react";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, X } from "lucide-react";

export const FiltersWithHook = () => {
  const {
    filter,
    loading,
    reloadCars,
    clearFilter,
    setSearchTerm,
    setBrand,
    setBodyType,
    toggleOnlyNew,
    availableBrands,
    availableBodyTypes,
  } = useSearchFilters();

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Фильтры</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilter}
            className="h-8 text-xs flex items-center"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Сбросить
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={reloadCars}
            disabled={loading}
            className="h-8 text-xs flex items-center"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="search">Поиск</Label>
          <Input
            id="search"
            placeholder="Поиск по марке или модели"
            value={filter.search || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="brand">Марка</Label>
          <Select
            value={filter.brands && filter.brands.length > 0 ? filter.brands[0] : ""}
            onValueChange={(value) => setBrand(value === "all" ? null : value)}
          >
            <SelectTrigger id="brand">
              <SelectValue placeholder="Все марки" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все марки</SelectItem>
              {availableBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="bodyType">Тип кузова</Label>
          <Select
            value={filter.bodyTypes && filter.bodyTypes.length > 0 ? filter.bodyTypes[0] : ""}
            onValueChange={(value) => setBodyType(value === "all" ? null : value)}
          >
            <SelectTrigger id="bodyType">
              <SelectValue placeholder="Все типы кузова" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы кузова</SelectItem>
              {availableBodyTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="onlyNew" 
            checked={filter.isNew || false}
            onCheckedChange={() => toggleOnlyNew()}
          />
          <Label htmlFor="onlyNew">Только новые</Label>
        </div>
      </div>
    </div>
  );
};

export default FiltersWithHook;
