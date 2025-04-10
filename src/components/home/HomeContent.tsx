
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
  const initialParamsApplied = useRef(false);
  const loadTriggered = useRef(false);

  useEffect(() => {
    if (!initialParamsApplied.current && !loadTriggered.current) {
      initialParamsApplied.current = true;
      loadTriggered.current = true;
      
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
    }
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

  // Получаем новые автомобили по признаку "isNew"
  const newCars = cars.filter(car => car.isNew).slice(0, 8);
  
  // Сортируем автомобили по дате добавления (используем id как прокси для даты, т.к. id обычно содержит timestamp)
  // Если в данных есть реальное поле с датой добавления, используйте его вместо этого
  const recentlyAddedCars = [...cars].sort((a, b) => {
    // Если есть поле "created_at" или аналогичное, используйте его
    // Иначе, используем id как прокси для сортировки (последние добавленные имеют больший id)
    return b.id.localeCompare(a.id);
  }).slice(0, 8);
  
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

      {/* Новые поступления (последние добавленные) */}
      {recentlyAddedCars.length > 0 && (
        <FeaturedCars 
          cars={recentlyAddedCars} 
          title="Новые поступления" 
          subtitle="Самые свежие модели в нашем каталоге"
          loading={loading}
          error={error}
          onRetry={reloadCars}
        />
      )}
      
      {/* Отдельный блок для новых автомобилей (с маркером isNew) */}
      {newCars.length > 0 && (
        <FeaturedCars 
          cars={newCars} 
          title="Новинки рынка" 
          subtitle="Новые модели автомобилей"
          loading={loading}
          error={error}
          onRetry={reloadCars}
        />
      )}
      
      {popularCars.length > 0 && (
        <FeaturedCars 
          cars={popularCars} 
          title="Популярные модели" 
          subtitle="Автомобили, которые чаще всего выбирают наши пользователи"
          loading={loading}
          error={error}
          onRetry={reloadCars}
        />
      )}

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
