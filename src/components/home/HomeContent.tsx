
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedCars from "@/components/FeaturedCars";
import SearchFiltersModal from "@/components/SearchFiltersModal";
import ComparePanel from "@/components/ComparePanel";
import { useCars } from "@/hooks/useCars";
import { useIsMobile } from "@/hooks/use-mobile";

// Import new component files
import HeroBanner from "./HeroBanner";
import FeatureCards from "./FeatureCards";
import HomeCatalog from "./HomeCatalog";
import ConsultSection from "./ConsultSection";

const HomeContent = () => {
  const { cars, filteredCars, setFilter, filter, loading, error, reloadCars } = useCars();
  const [searchParams] = useSearchParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const consultFormRef = useRef<HTMLDivElement>(null);
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
  }, [searchParams, setFilter, filter]);

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const scrollToConsultForm = () => {
    consultFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const newCars = cars.filter(car => car.isNew).slice(0, 8);
  const popularCars = cars.filter(car => car.isPopular).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <HeroBanner 
        openFilterModal={openFilterModal} 
        scrollToConsultForm={scrollToConsultForm} 
      />
      
      <SearchFiltersModal 
        isOpen={isFilterModalOpen} 
        onClose={closeFilterModal} 
        scrollToContactForm={scrollToConsultForm} 
      />

      <FeatureCards />

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

      <HomeCatalog 
        loading={loading}
        filter={filter}
        filteredCars={filteredCars}
        setFilter={setFilter}
        openFilterModal={openFilterModal}
        isMobile={isMobile}
      />

      <ConsultSection consultFormRef={consultFormRef} />

      <ComparePanel />
      <Footer />
    </div>
  );
};

export default HomeContent;
