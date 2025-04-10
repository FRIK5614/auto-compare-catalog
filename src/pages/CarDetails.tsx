
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComparePanel from "@/components/ComparePanel";
import { CarsProvider } from "@/contexts/CarsContext";
import CarDetailsContent from "@/components/car-details/CarDetailsContent";

const CarDetails = () => {
  return (
    <CarsProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <CarDetailsContent />
        <ComparePanel />
        <Footer />
      </div>
    </CarsProvider>
  );
};

export default CarDetails;
