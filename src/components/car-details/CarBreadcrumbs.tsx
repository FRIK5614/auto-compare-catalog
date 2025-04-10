
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Car } from "@/types/car";

interface CarBreadcrumbsProps {
  car: Car;
}

const CarBreadcrumbs: React.FC<CarBreadcrumbsProps> = ({ car }) => {
  return (
    <div className="bg-auto-gray-50 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center text-sm text-auto-gray-600">
          <Link to="/" className="hover:text-auto-blue-600">Главная</Link>
          <ChevronRight className="h-3 w-3 mx-2" />
          <Link to="/catalog" className="hover:text-auto-blue-600">Каталог</Link>
          <ChevronRight className="h-3 w-3 mx-2" />
          <Link to={`/catalog?brand=${car.brand}`} className="hover:text-auto-blue-600">{car.brand}</Link>
          <ChevronRight className="h-3 w-3 mx-2" />
          <span className="text-auto-gray-900">{car.model}</span>
        </div>
      </div>
    </div>
  );
};

export default CarBreadcrumbs;
