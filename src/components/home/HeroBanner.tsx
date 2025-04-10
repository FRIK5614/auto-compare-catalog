
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Settings, UserRound } from "lucide-react";

interface HeroBannerProps {
  openFilterModal: () => void;
  scrollToConsultForm: () => void;
}

const HeroBanner = ({ openFilterModal, scrollToConsultForm }: HeroBannerProps) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default HeroBanner;
