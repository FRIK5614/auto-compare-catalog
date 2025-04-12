
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComparePanel from "@/components/ComparePanel";
import FeaturedCars from "@/components/FeaturedCars";
import { useCars } from "@/hooks/useCars";

const HotOffers = () => {
  const { cars, loading, error, reloadCars, filter, setFilter } = useCars();
  
  // Apply discount filter when component mounts
  useEffect(() => {
    setFilter({
      ...filter,
      discount: true
    });
  }, []);
  
  // Get cars with discounts
  const discountCars = cars.filter(car => 
    car.price && car.price.discount && car.price.discount > 0
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Специальные предложения - Выгодные цены на автомобили</title>
        <meta 
          name="description" 
          content="Автомобили со скидками и специальными предложениями. Выгодные цены на новые и подержанные автомобили различных марок и моделей."
        />
        <link rel="canonical" href={`${window.location.origin}/special-offers`} />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-auto-gray-900">
            Специальные предложения
          </h1>
          
          <p className="text-auto-gray-600 mb-8 max-w-3xl">
            Ниже представлены автомобили с действующими скидками и специальными предложениями. 
            Успейте приобрести автомобиль вашей мечты на выгодных условиях!
          </p>
          
          <FeaturedCars 
            cars={discountCars} 
            title="Автомобили со скидкой" 
            subtitle="Специальные цены на ограниченное время"
            loading={loading}
            error={error}
            onRetry={reloadCars}
          />
        </div>
      </main>
      
      <ComparePanel />
      <Footer />
    </div>
  );
};

export default HotOffers;
