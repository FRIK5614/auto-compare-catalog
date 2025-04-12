
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComparePanel from "@/components/ComparePanel";
import { CarsProvider } from "@/contexts/CarsContext";
import CarDetailsContent from "@/components/car-details/CarDetailsContent";
import { useCars } from "@/hooks/useCars";
import { Helmet } from "react-helmet";

const CarDetails = () => {
  const { id, brand, model } = useParams<{ id: string; brand: string; model: string }>();
  const { getCarById, cars, loading } = useCars();
  const car = id ? getCarById(id) : null;
  
  // Check if URL params match car data (for proper canonical URL)
  const urlIsCorrect = car && 
                      brand?.toLowerCase() === car.brand.toLowerCase() && 
                      model?.toLowerCase() === car.model.toLowerCase();
                      
  // Redirect to correct URL if parameters don't match
  if (!loading && car && !urlIsCorrect) {
    return <Navigate to={`/cars/${car.brand.toLowerCase()}/${car.model.toLowerCase()}/${car.id}`} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {car && (
        <Helmet>
          <title>{`${car.brand} ${car.model} ${car.year} - Подробная информация`}</title>
          <meta 
            name="description" 
            content={`${car.brand} ${car.model} ${car.year} - ${car.engine.type} ${car.engine.displacement}л, ${car.engine.power} л.с., ${car.transmission.type}. Подробная информация, фото и технические характеристики.`} 
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
