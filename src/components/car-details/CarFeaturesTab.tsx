
import React from "react";
import { Car } from "@/types/car";

interface CarFeaturesTabProps {
  car: Car;
}

const CarFeaturesTab: React.FC<CarFeaturesTabProps> = ({ car }) => {
  // Early return if features is not available or empty
  if (!car.features || !Array.isArray(car.features) || car.features.length === 0) {
    return <p className="text-auto-gray-600">Информация о комплектации отсутствует.</p>;
  }

  // Group features by category
  const featuresByCategory = car.features.reduce((acc: {[key: string]: typeof car.features}, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(featuresByCategory).map(([category, features]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-auto-gray-200">
            {category}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map(feature => (
              <li key={feature.id} className="flex items-start">
                <span className={`inline-block w-4 h-4 rounded-full mt-1 mr-2 ${
                  feature.isStandard 
                    ? "bg-green-500" 
                    : "bg-auto-gray-300"
                }`}></span>
                <span>
                  {feature.name}
                  {!feature.isStandard && (
                    <span className="text-auto-gray-500 text-sm"> (опция)</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CarFeaturesTab;
