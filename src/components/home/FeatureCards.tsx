
import React from "react";
import { Car, CarFront, Settings } from "lucide-react";

const FeatureCards = () => {
  return (
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
  );
};

export default FeatureCards;
