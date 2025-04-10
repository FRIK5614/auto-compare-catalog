
import React from "react";
import { CarsProvider } from "@/contexts/CarsContext";
import HomeContent from "@/components/home/HomeContent";

const Index = () => {
  return (
    <CarsProvider>
      <HomeContent />
    </CarsProvider>
  );
};

export default Index;
