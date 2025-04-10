
import React from "react";
import { Button } from "@/components/ui/button";
import { Car } from "@/types/car";
import { Heart, BarChart2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarTitleProps {
  car: Car;
  isFavorite: boolean;
  isInCompare: boolean;
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => void;
}

const CarTitle: React.FC<CarTitleProps> = ({
  car,
  isFavorite,
  isInCompare,
  toggleFavorite,
  toggleCompare
}) => {
  return (
    <div className="bg-white border-b border-auto-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-auto-gray-900">
              {car.brand} {car.model}
            </h1>
            <p className="text-auto-gray-600 mt-1">
              {car.year} • {car.engine.type} {car.engine.displacement}л • {car.engine.power} л.с. • {car.transmission.type}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                navigator.share({
                  title: `${car.brand} ${car.model}`,
                  text: `Посмотрите ${car.brand} ${car.model} в нашем каталоге`,
                  url: window.location.href,
                }).catch(() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Ссылка скопирована в буфер обмена");
                });
              }}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Поделиться
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center",
                isFavorite && "text-red-500 hover:text-red-700 border-red-500 hover:bg-red-50"
              )}
              onClick={() => toggleFavorite(car.id)}
            >
              <Heart 
                className="h-4 w-4 mr-1" 
                fill={isFavorite ? "currentColor" : "none"} 
              />
              {isFavorite ? "В избранном" : "В избранное"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center",
                isInCompare && "text-auto-blue-600 hover:text-auto-blue-700 border-auto-blue-600 hover:bg-auto-blue-50"
              )}
              onClick={() => toggleCompare(car.id)}
            >
              <BarChart2 className="h-4 w-4 mr-1" />
              {isInCompare ? "В сравнении" : "Сравнить"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarTitle;
