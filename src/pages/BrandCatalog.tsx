
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import ComparePanel from "@/components/ComparePanel";
import { useCars } from "@/hooks/useCars";
import { useIsMobile } from "@/hooks/use-mobile";
import CarLoadingAnimation from "@/components/CarLoadingAnimation";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { EmptyResults } from "@/components/catalog/EmptyResults";
import { mapSortOptionFromFilter, mapSortOptionToFilter } from "@/components/catalog/SortOptions";
import SearchFiltersModal from "@/components/SearchFiltersModal";
import { Helmet } from "react-helmet-async";

const BrandCatalog = () => {
  const { brand } = useParams<{ brand: string }>();
  const { filteredCars, filter, setFilter, loading, cars } = useCars();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<string>("default");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const CARS_PER_PAGE = 12;
  
  useEffect(() => {
    if (!brand) return;
    
    // Set brand filter when component mounts or brand changes
    const newFilter = { ...filter, brand, brands: [brand] };
    setFilter(newFilter);
    
    // Set page and sort from URL if present
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setCurrentPage(parseInt(pageParam, 10));
    }

    const sortParam = searchParams.get("sort");
    if (sortParam) {
      setSortOption(sortParam);
      newFilter.sortBy = mapSortOptionToFilter(sortParam);
      setFilter(newFilter);
    }
  }, [brand]);

  useEffect(() => {
    // Update URL when page or sort changes
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", currentPage.toString());
    newParams.set("sort", sortOption);
    setSearchParams(newParams, { replace: true });
  }, [currentPage, sortOption]);

  // Check if brand exists in our database
  const brandExists = React.useMemo(() => {
    const brands = [...new Set(cars.map(car => car.brand))];
    return brands.some(b => b.toLowerCase() === brand?.toLowerCase());
  }, [cars, brand]);

  // If brand doesn't exist, redirect to main catalog
  useEffect(() => {
    if (!loading && cars.length > 0 && !brandExists && brand) {
      navigate('/cars', { replace: true });
    }
  }, [loading, cars, brandExists, brand, navigate]);

  const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE);
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

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{brand ? `${brand} Автомобили` : 'Каталог автомобилей'}</title>
        <meta name="description" content={`Все автомобили марки ${brand} в каталоге. Просмотрите доступные модели, цены и характеристики.`} />
        <link rel="canonical" href={`${window.location.origin}/cars/brand/${brand}`} />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <section className="py-6 md:py-10 bg-auto-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Автомобили {brand}</h1>
            
            <div className="relative z-30">
              <CatalogHeader 
                count={filteredCars.length}
                loading={loading}
                isMobile={isMobile}
                sortOption={sortOption}
                onSortChange={handleSortChange}
                onOpenFilterModal={openFilterModal}
              />
            </div>
            
            <div className="flex flex-col md:flex-row">
              <div className={`${isMobile ? 'hidden' : 'block'} md:w-1/3 lg:w-1/4 pr-4`}>
                <div className="sticky top-20">
                  <SearchFilters filter={filter} setFilter={setFilter} />
                </div>
              </div>
              
              <div className={`w-full ${isMobile ? '' : 'md:w-2/3 lg:w-3/4'} ${isMobile ? '' : 'md:pl-6'}`}>
                {loading ? (
                  <div className="flex justify-center items-center min-h-[400px]">
                    <CarLoadingAnimation />
                  </div>
                ) : currentPageCars.length === 0 ? (
                  <EmptyResults onOpenFilterModal={openFilterModal} />
                ) : (
                  <CatalogGrid 
                    cars={currentPageCars}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
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

export default BrandCatalog;
