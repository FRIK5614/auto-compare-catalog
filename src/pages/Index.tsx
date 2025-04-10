
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedCars from "@/components/FeaturedCars";
import SearchFilters from "@/components/SearchFilters";
import CarCard from "@/components/CarCard";
import ComparePanel from "@/components/ComparePanel";
import PurchaseRequestForm from "@/components/PurchaseRequestForm";
import SearchFiltersModal from "@/components/SearchFiltersModal";
import { Button } from "@/components/ui/button";
import { useCars } from "@/hooks/useCars";
import { CarsProvider } from "@/contexts/CarsContext";
import { ChevronDown, Car, CarFront, Settings, UserRound, Filter } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mapping для сортировок между UI и фильтром
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

const sortOptions = [
  { label: "По умолчанию", value: "default" },
  { label: "По цене (возрастание)", value: "price_asc" },
  { label: "По цене (убывание)", value: "price_desc" },
  { label: "По году (новые)", value: "year_desc" },
  { label: "По году (старые)", value: "year_asc" },
  { label: "По названию (А-Я)", value: "name_asc" },
  { label: "По названию (Я-А)", value: "name_desc" }
];

const IndexContent = () => {
  const { cars, filteredCars, setFilter, filter, loading, error, reloadCars, applySorting } = useCars();
  const [searchParams] = useSearchParams();
  const [visibleCars, setVisibleCars] = useState(12);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>(mapSortOptionFromFilter(filter.sortBy));
  const consultFormRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const newFilter: any = { ...filter };
    
    const bodyType = searchParams.get("bodyType");
    if (bodyType) {
      newFilter.bodyTypes = [bodyType];
    }
    
    if (searchParams.get("filter") === "new") {
      newFilter.isNew = true;
    }
    
    const brand = searchParams.get("brand");
    if (brand) {
      newFilter.brands = [brand];
    }
    
    newFilter.limit = 24;
    
    setFilter(newFilter);
  }, [searchParams, setFilter]);

  const loadMore = () => {
    const params = new URLSearchParams(searchParams);
    navigate(`/catalog?${params.toString()}`);
  };

  const newCars = cars.filter(car => car.isNew).slice(0, 8);
  const popularCars = cars.filter(car => car.isPopular).slice(0, 8);

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const scrollToConsultForm = () => {
    consultFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setFilter({
      ...filter,
      sortBy: mapSortOptionToFilter(value)
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="relative bg-gradient-to-r from-auto-blue-900 to-auto-blue-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Найдите автомобиль своей мечты
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                Более 1000 моделей автомобилей с подробными характеристиками, ценами и возможностью сравнения
              </p>
              <div className="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  className="w-full bg-white text-auto-blue-800 hover:bg-blue-50"
                  onClick={() => navigate('/catalog')}
                >
                  <Car className="mr-2 h-5 w-5" />
                  Все автомобили
                </Button>
                <Button 
                  size="lg" 
                  className="w-full bg-auto-blue-500 text-white hover:bg-auto-blue-600"
                  onClick={openFilterModal}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Подбор по параметрам
                </Button>
              </div>
              <div className="mt-4">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full bg-transparent border-white text-white hover:bg-white hover:text-auto-blue-800"
                  onClick={scrollToConsultForm}
                >
                  <UserRound className="mr-2 h-5 w-5" />
                  Подобрать через специалиста
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-auto-blue-500 rounded-full opacity-50"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-auto-blue-500 rounded-full opacity-40"></div>
                <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-auto-blue-500 rounded-full opacity-30"></div>
                <div className="bg-auto-blue-800/30 backdrop-blur-sm rounded-lg p-4 relative z-10">
                  <img
                    src="/placeholder.svg"
                    alt="Автомобиль"
                    className="w-full h-auto rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="w-full h-auto"
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 0L60 10C120 20 240 40 360 50C480 60 600 60 720 50C840 40 960 20 1080 15C1200 10 1320 20 1380 25L1440 30V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      <SearchFiltersModal isOpen={isFilterModalOpen} onClose={closeFilterModal} scrollToContactForm={scrollToConsultForm} />

      <section className="py-12 bg-auto-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-auto-blue-50 rounded-full flex items-center justify-center mb-4">
                <Car className="h-8 w-8 text-auto-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Большой выбор</h3>
              <p className="text-auto-gray-600">
                Более 1000 моделей автомобилей от всех ведущих производителей с подробным описанием.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-auto-blue-50 rounded-full flex items-center justify-center mb-4">
                <CarFront className="h-8 w-8 text-auto-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Детальное сравнение</h3>
              <p className="text-auto-gray-600">
                Сравнивайте до 3 автомобилей одновременно по всем техническим характеристикам.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-auto-blue-50 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-8 w-8 text-auto-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Удобный подбор</h3>
              <p className="text-auto-gray-600">
                Используйте фильтры для выбора автомобиля по любым параметрам и характеристикам.
              </p>
            </div>
          </div>
        </div>
      </section>

      {newCars.length > 0 || loading ? (
        <FeaturedCars 
          cars={newCars} 
          title="Новые поступления" 
          subtitle="Самые свежие модели в нашем каталоге"
          loading={loading}
          error={error}
          onRetry={reloadCars}
        />
      ) : null}
      
      {popularCars.length > 0 || loading ? (
        <FeaturedCars 
          cars={popularCars} 
          title="Популярные модели" 
          subtitle="Автомобили, которые чаще всего выбирают наши пользователи"
          loading={loading}
          error={error}
          onRetry={reloadCars}
        />
      ) : null}

      <section className="py-12 bg-auto-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-auto-gray-900">Каталог автомобилей</h2>
          
          <div className="flex flex-col md:flex-row">
            <div className={`${isMobile ? 'hidden' : 'block'} md:w-1/4 lg:w-1/5`}>
              <SearchFilters filter={filter} setFilter={setFilter} />
            </div>
            
            <div className={`w-full ${isMobile ? '' : 'md:w-3/4 lg:w-4/5'} ${isMobile ? '' : 'md:pl-6'}`}>
              {isMobile && (
                <div className="mb-4">
                  <Button 
                    variant="blue" 
                    onClick={openFilterModal} 
                    className="w-full flex items-center justify-center"
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
                  <div className="mb-4 flex justify-between items-center">
                    <p className="text-auto-gray-600">
                      Найдено автомобилей: <span className="font-semibold">{filteredCars.length}</span>
                    </p>
                    <div className="flex items-center">
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

      <section className="py-16 bg-white" ref={consultFormRef}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h2 className="text-3xl font-bold mb-4 text-auto-gray-900">
                Нужна консультация?
              </h2>
              <p className="text-lg text-auto-gray-600 mb-6">
                Заполните форму, и наш менеджер свяжется с вами в ближайшее время, чтобы ответить на все ваши вопросы и помочь с выбором автомобиля.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-auto-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-auto-blue-600 font-medium">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-auto-gray-900">Профессиональная консультация</h4>
                    <p className="text-auto-gray-600">Наши эксперты помогут выбрать автомобиль под ваши потребности</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-auto-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-auto-blue-600 font-medium">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-auto-gray-900">Индивидуальный подбор</h4>
                    <p className="text-auto-gray-600">Учтем все ваши пожелания и бюджет при выборе автомобиля</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-auto-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-auto-blue-600 font-medium">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-auto-gray-900">Быстрый ответ</h4>
                    <p className="text-auto-gray-600">Мы свяжемся с вами в течение 30 минут в рабочее время</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="md:w-1/2">
              <PurchaseRequestForm />
            </div>
          </div>
        </div>
      </section>

      <ComparePanel />
      <Footer />
    </div>
  );
};

const Index = () => {
  return (
    <CarsProvider>
      <IndexContent />
    </CarsProvider>
  );
};

export default Index;
