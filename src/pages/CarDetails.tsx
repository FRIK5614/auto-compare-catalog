
import React, { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComparePanel from "@/components/ComparePanel";
import CarDetailsContent from "@/components/car-details/CarDetailsContent";
import { useCars } from "@/hooks/useCars";
import { Helmet } from "react-helmet-async";
import LoadingState from "@/components/LoadingState";

const CarDetails = () => {
  const { id, brand, model } = useParams<{ id: string; brand: string; model: string }>();
  const { getCarById, cars, loading, viewCar, reloadCars } = useCars();
  
  // Load car data if needed
  useEffect(() => {
    if (id && !loading && cars.length === 0) {
      console.log("Loading cars for car details page");
      reloadCars();
    }
    
    // Increment view count when viewing car details
    if (id && !loading) {
      viewCar(id);
    }
  }, [id, reloadCars, loading, cars.length, viewCar]);
  
  const car = id ? getCarById(id) : null;
  
  // Check if URL params match car data (for proper canonical URL)
  const urlIsCorrect = car && 
                      (!brand || brand.toLowerCase() === car.brand.toLowerCase()) && 
                      (!model || model.toLowerCase() === car.model.toLowerCase());
                      
  // Redirect to correct URL if parameters don't match
  if (!loading && car && !urlIsCorrect) {
    return <Navigate to={`/cars/${car.brand.toLowerCase()}/${car.model.toLowerCase()}/${car.id}`} replace />;
  }

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <LoadingState />
        </div>
        <Footer />
      </div>
    );
  }

  // If car not found, show not found page
  if (!loading && !car && id) {
    console.error(`Car with ID ${id} not found`);
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-10">
            <h1 className="text-2xl font-bold mb-4">Автомобиль не найден</h1>
            <p className="mb-6">К сожалению, информация об автомобиле недоступна или автомобиль был удален.</p>
            <a href="/cars" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Вернуться в каталог
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {car && (
        <Helmet>
          <title>{`${car.brand} ${car.model} ${car.year} - Подробная информация`}</title>
          <meta 
            name="description" 
            content={`${car.brand} ${car.model} ${car.year} - ${car.engine?.type || ''} ${car.engine?.displacement || ''}л, ${car.engine?.power || ''} л.с., ${car.transmission?.type || ''}. Подробная информация, фото и технические характеристики.`} 
          />
          <link rel="canonical" href={`${window.location.origin}/cars/${car.brand.toLowerCase()}/${car.model.toLowerCase()}/${car.id}`} />
          <meta property="og:title" content={`${car.brand} ${car.model} ${car.year}`} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${window.location.origin}/cars/${car.brand.toLowerCase()}/${car.model.toLowerCase()}/${car.id}`} />
          {car.image_url && <meta property="og:image" content={car.image_url} />}
          <meta property="og:description" content={car.description?.substring(0, 160) || `${car.brand} ${car.model} ${car.year} - подробная информация`} />
        </Helmet>
      )}
      <Header />
      <CarDetailsContent />
      <ComparePanel />
      <Footer />
    </div>
  );
};

export default CarDetails;
