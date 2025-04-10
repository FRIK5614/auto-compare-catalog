
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCars } from "@/hooks/useCars";
import { CarFilter } from "@/types/car";
import { Search, SlidersHorizontal, X, Check, Filter } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchFiltersProps {
  filter: CarFilter;
  setFilter: (filter: CarFilter) => void;
  className?: string;
  closeModal?: () => void;
  isInModal?: boolean;
}

const SearchFilters = ({ filter, setFilter, className, closeModal, isInModal }: SearchFiltersProps) => {
  const { getUniqueValues, getPriceRange, getYearRange } = useCars();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [yearRange, setYearRange] = useState<[number, number]>([1990, new Date().getFullYear()]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Get unique values for dropdowns
  const brands = getUniqueValues("brand");
  const bodyTypes = getUniqueValues("bodyType");
  const fuelTypes = getUniqueValues("engine").map(e => e?.fuelType).filter(Boolean) as string[];
  const transmissionTypes = getUniqueValues("transmission").map(t => t?.type).filter(Boolean) as string[];
  const countries = getUniqueValues("country");
  
  useEffect(() => {
    // Initialize price and year ranges
    const { min: minPrice, max: maxPrice } = getPriceRange();
    const { min: minYear, max: maxYear } = getYearRange();
    
    setPriceRange([
      filter.minPrice || minPrice,
      filter.maxPrice || maxPrice
    ]);
    
    setYearRange([
      filter.minYear || minYear,
      filter.maxYear || maxYear
    ]);
    
    // Count active filters
    const active = [];
    if (filter.search) active.push("search");
    if (filter.brand) active.push("brand");
    if (filter.bodyType) active.push("bodyType");
    if (filter.minPrice || filter.maxPrice) active.push("price");
    if (filter.minYear || filter.maxYear) active.push("year");
    if (filter.fuelType) active.push("fuelType");
    if (filter.transmissionType) active.push("transmissionType");
    if (filter.country) active.push("country");
    if (filter.onlyNew) active.push("onlyNew");
    setActiveFilters(active);
    
  }, [filter, getPriceRange, getYearRange]);
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    
    // Debounce price updates to prevent too many re-renders
    const timer = setTimeout(() => {
      setFilter({
        ...filter,
        minPrice: value[0],
        maxPrice: value[1]
      });
    }, 300);
    
    return () => clearTimeout(timer);
  };
  
  const handleYearChange = (value: number[]) => {
    setYearRange([value[0], value[1]]);
    
    // Debounce year updates to prevent too many re-renders
    const timer = setTimeout(() => {
      setFilter({
        ...filter,
        minYear: value[0],
        maxYear: value[1]
      });
    }, 300);
    
    return () => clearTimeout(timer);
  };
  
  const resetFilters = () => {
    setFilter({
      search: "",
      sortBy: "popularity",
    });
  };
  
  const handleSortChange = (value: string) => {
    setFilter({
      ...filter,
      sortBy: value as CarFilter["sortBy"]
    });
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold flex items-center">
            <Filter className="mr-2 h-5 w-5 text-auto-blue-600" />
            Фильтры
            {activeFilters.length > 0 && (
              <Badge className="ml-2 bg-auto-blue-600">{activeFilters.length}</Badge>
            )}
          </h3>
          
          {activeFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-auto-gray-500 hover:text-auto-gray-700"
            >
              Сбросить
              <X className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Separator />
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-auto-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск по марке или модели"
            value={filter.search || ""}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="pl-9 bg-auto-gray-50 border-auto-gray-200"
          />
        </div>
        
        <ScrollArea className="h-[calc(100vh-380px)] pr-4">
          <Accordion type="multiple" defaultValue={["brand", "price", "bodyType"]} className="w-full">
            <AccordionItem value="brand" className="border-b border-auto-gray-200">
              <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                Марка
              </AccordionTrigger>
              <AccordionContent>
                <Select
                  value={filter.brand || ""}
                  onValueChange={(value) => setFilter({ ...filter, brand: value || undefined })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Все марки" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все марки</SelectItem>
                    {brands.sort().map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="price" className="border-b border-auto-gray-200">
              <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                Цена
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  <div>
                    <Slider
                      value={[priceRange[0], priceRange[1]]}
                      min={getPriceRange().min}
                      max={getPriceRange().max}
                      step={10000}
                      onValueChange={handlePriceChange}
                      className="mt-6"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <Label htmlFor="minPrice" className="text-sm text-auto-gray-600">
                        От
                      </Label>
                      <div className="font-medium">{formatPrice(priceRange[0])}</div>
                    </div>
                    <div className="flex-1 text-right">
                      <Label htmlFor="maxPrice" className="text-sm text-auto-gray-600">
                        До
                      </Label>
                      <div className="font-medium">{formatPrice(priceRange[1])}</div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="bodyType" className="border-b border-auto-gray-200">
              <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                Тип кузова
              </AccordionTrigger>
              <AccordionContent>
                <Select
                  value={filter.bodyType || ""}
                  onValueChange={(value) => setFilter({ ...filter, bodyType: value || undefined })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Все типы кузова" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы кузова</SelectItem>
                    {bodyTypes.sort().map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="year" className="border-b border-auto-gray-200">
              <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                Год выпуска
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  <div>
                    <Slider
                      value={[yearRange[0], yearRange[1]]}
                      min={getYearRange().min}
                      max={getYearRange().max}
                      step={1}
                      onValueChange={handleYearChange}
                      className="mt-6"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <Label htmlFor="minYear" className="text-sm text-auto-gray-600">
                        От
                      </Label>
                      <div className="font-medium">{yearRange[0]}</div>
                    </div>
                    <div className="flex-1 text-right">
                      <Label htmlFor="maxYear" className="text-sm text-auto-gray-600">
                        До
                      </Label>
                      <div className="font-medium">{yearRange[1]}</div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="fuelType" className="border-b border-auto-gray-200">
              <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                Тип топлива
              </AccordionTrigger>
              <AccordionContent>
                <Select
                  value={filter.fuelType || ""}
                  onValueChange={(value) => setFilter({ ...filter, fuelType: value || undefined })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Все типы топлива" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы топлива</SelectItem>
                    {Array.from(new Set(fuelTypes)).sort().map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="transmission" className="border-b border-auto-gray-200">
              <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                Коробка передач
              </AccordionTrigger>
              <AccordionContent>
                <Select
                  value={filter.transmissionType || ""}
                  onValueChange={(value) => setFilter({ ...filter, transmissionType: value || undefined })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Все типы КПП" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы КПП</SelectItem>
                    {Array.from(new Set(transmissionTypes)).sort().map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="country" className="border-b border-auto-gray-200">
              <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                Страна производства
              </AccordionTrigger>
              <AccordionContent>
                <Select
                  value={filter.country || ""}
                  onValueChange={(value) => setFilter({ ...filter, country: value || undefined })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Все страны" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все страны</SelectItem>
                    {countries.sort().map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="extra" className="border-b-0">
              <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                Дополнительно
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="onlyNew" 
                      checked={filter.onlyNew || false}
                      onCheckedChange={(checked) => 
                        setFilter({ ...filter, onlyNew: checked ? true : undefined })
                      }
                    />
                    <Label htmlFor="onlyNew" className="cursor-pointer">
                      Только новые
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>
      
      {/* Moved sorting out of filters */}
      <div className="p-4 border-t border-auto-gray-200">
        <div className="mb-2">
          <h3 className="font-medium">Сортировка</h3>
        </div>
        <Select
          value={filter.sortBy || "popularity"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="bg-white w-full">
            <SelectValue placeholder="По популярности" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">По популярности</SelectItem>
            <SelectItem value="priceAsc">По цене (сначала дешевле)</SelectItem>
            <SelectItem value="priceDesc">По цене (сначала дороже)</SelectItem>
            <SelectItem value="yearDesc">По году (сначала новее)</SelectItem>
            <SelectItem value="yearAsc">По году (сначала старше)</SelectItem>
          </SelectContent>
        </Select>
        
        {isInModal && closeModal && (
          <div className="mt-4">
            <Button className="w-full" onClick={closeModal}>
              Применить фильтры
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
