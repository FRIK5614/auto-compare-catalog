import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import CarCard from "@/components/CarCard";
import ComparePanel from "@/components/ComparePanel";
import { Button } from "@/components/ui/button";
import { useCars } from "@/hooks/useCars";
import { 
  SlidersHorizontal, 
  ArrowUpDown,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SearchFiltersModal from "@/components/SearchFiltersModal";
import { Car } from "@/types/car";
import LoadingState from "@/components/LoadingState";
import { useIsMobile } from "@/hooks/use-mobile";
import CarLoadingAnimation from "@/components/CarLoadingAnimation";

type SortOption = {
  label: string;
  value: string;
  sortFn: (a: Car, b: Car) => number;
};

const sortOptions: SortOption[] = [
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

const mapSortOptionFromFilter = (filterSort?: string): string => {
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

const mapSortOptionToFilter = (sortOption: string): "popularity" | "priceAsc" | "priceDesc" | "yearDesc" | "yearAsc" | "nameAsc" | "nameDesc" => {
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

const Catalog = () => {
  const { filteredCars, filter, setFilter, loading } = useCars();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<string>("default");
  const isMobile = useIsMobile();

  const CARS_PER_PAGE = 12;
  const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE);

  useEffect(() => {
    const newFilter: any = { ...filter };
    
    const bodyType = searchParams.get("bodyType");
    if (bodyType) {
      newFilter.bodyType = bodyType;
    }
    
    if (searchParams.get("filter") === "new") {
      newFilter.onlyNew = true;
    }
    
    const brand = searchParams.get("brand");
    if (brand) {
      newFilter.brand = brand;
    }
    
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setCurrentPage(parseInt(pageParam, 10));
    }

    const sortParam = searchParams.get("sort");
    if (sortParam && sortOptions.some(option => option.value === sortParam)) {
      setSortOption(sortParam);
      newFilter.sortBy = mapSortOptionToFilter(sortParam);
    } else {
      setSortOption(mapSortOptionFromFilter(newFilter.sortBy));
    }
    
    setFilter(newFilter);
  }, []);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", currentPage.toString());
    newParams.set("sort", sortOption);
    setSearchParams(newParams, { replace: true });
  }, [currentPage, sortOption]);

  const startIndex = (currentPage - 1) * CARS_PER_PAGE;
  const currentPageCars = filteredCars.slice(startIndex, startIndex + CARS_PER_PAGE);

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setFilter({
      ...filter,
      sortBy: mapSortOptionToFilter(value)
    });
    
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            isActive={currentPage === 1} 
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-6 md:py-10 bg-auto-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-auto-gray-900">Каталог автомобилей</h1>
                {!loading && (
                  <p className="text-auto-gray-600 mt-1">
                    Найдено {filteredCars.length} автомобилей
                  </p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
                {isMobile && (
                  <Button 
                    variant="blue" 
                    className="flex items-center" 
                    onClick={openFilterModal}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Фильтры
                  </Button>
                )}
                
                <Select value={sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row">
              <div className={`${isMobile ? 'hidden' : 'block'} md:w-1/4 lg:w-1/5`}>
                <div className="sticky top-4">
                  <SearchFilters filter={filter} setFilter={setFilter} />
                </div>
              </div>
              
              <div className={`w-full ${isMobile ? '' : 'md:w-3/4 lg:w-4/5'} ${isMobile ? '' : 'md:pl-6'}`}>
                {loading ? (
                  <div className="flex justify-center items-center min-h-[400px]">
                    <CarLoadingAnimation />
                  </div>
                ) : currentPageCars.length === 0 ? (
                  <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg text-center">
                    <div className="w-16 h-16 bg-auto-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ArrowUpDown className="h-8 w-8 text-auto-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-auto-gray-700 mb-2">Автомобили не найдены</h3>
                    <p className="text-auto-gray-500 mb-6">
                      По выбранным фильтрам не найдено ни одного автомобиля. Попробуйте изменить параметры поиска.
                    </p>
                    <Button variant="blue" onClick={openFilterModal}>
                      Изменить фильтры
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentPageCars.map(car => (
                        <CarCard key={car.id} car={car} />
                      ))}
                    </div>
                    
                    {totalPages > 1 && (
                      <div className="mt-8">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                            
                            {generatePaginationItems()}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <SearchFiltersModal 
        isOpen={isFilterModalOpen} 
        onClose={closeFilterModal}
      />
      
      <ComparePanel />
      <Footer />
    </div>
  );
};

export default Catalog;
