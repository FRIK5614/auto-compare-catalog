import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Filter, Car } from "lucide-react";
import { Car as CarType } from "@/types/car";
import { CarFilter } from "@/types/car";
import SearchFilters from "@/components/SearchFilters";
import CarCard from "@/components/CarCard";
import LoadingState from "@/components/LoadingState";
import { SortOptions } from "@/components/catalog/SortOptions";
import { mapSortOptionFromFilter, mapSortOptionToFilter } from "@/components/catalog/SortOptions";

interface HomeCatalogProps {
  loading: boolean;
  filter: CarFilter;
  filteredCars: CarType[];
  setFilter: (filter: CarFilter) => void;
  openFilterModal: () => void;
  isMobile: boolean;
}

const HomeCatalog = ({ 
  loading, 
  filter, 
  filteredCars, 
  setFilter, 
  openFilterModal, 
  isMobile 
}: HomeCatalogProps) => {
  const navigate = useNavigate();
  const [visibleCars, setVisibleCars] = React.useState(12);
  const [sortOption, setSortOption] = React.useState<string>(mapSortOptionFromFilter(filter.sortBy));
  
  const handleSortChange = (value: string) => {
    setSortOption(value);
    setFilter({
      ...filter,
      sortBy: mapSortOptionToFilter(value)
    });
  };

  const loadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    navigate('/cars');
  };

  return (
    <section className="py-12 bg-auto-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-auto-gray-900">Каталог автомобилей</h2>
        
        <div className="flex flex-col md:flex-row">
          <div className={`${isMobile ? 'hidden' : 'block'} md:w-1/3 lg:w-1/4 pr-4`}>
            <div className="sticky top-20">
              <SearchFilters filter={filter} setFilter={setFilter} />
            </div>
          </div>
          
          <div className={`w-full ${isMobile ? '' : 'md:w-2/3 lg:w-3/4'} ${isMobile ? '' : 'md:pl-6'}`}>
            {isMobile && (
              <div className="mb-4">
                <Button 
                  variant="blue" 
                  onClick={openFilterModal} 
                  className="w-full flex items-center justify-center"
                  data-no-card-click="true"
                >
                  <Filter className="mr-2 h-5 w-5" />
                  Открыть фильтры
                </Button>
              </div>
            )}
            
            {loading ? (
              <LoadingState count={visibleCars} type="card" />
            ) : filteredCars.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg text-center">
                <Car className="h-16 w-16 text-auto-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-auto-gray-700 mb-2">Автомобили не найдены</h3>
                <p className="text-auto-gray-500 mb-6">
                  По выбранным фильтрам не найдено ни одного автомобиля. Попробуйте изменить параметры поиска.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <p className="text-auto-gray-600">
                    Найдено автомобилей: <span className="font-semibold">{filteredCars.length}</span>
                  </p>
                  <div className="w-full sm:w-auto relative z-30">
                    <SortOptions sortOption={sortOption} onSortChange={handleSortChange} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.slice(0, visibleCars).map(car => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
                
                {filteredCars.length > visibleCars && (
                  <div className="mt-8 flex justify-center">
                    <Button 
                      onClick={loadMore} 
                      variant="outline" 
                      className="px-8"
                      data-no-card-click="true"
                    >
                      Показать еще
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCatalog;
