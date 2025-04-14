
import React from "react";
import { Button } from "@/components/ui/button";
import { Car } from "@/types/car";
import { Heart, BarChart2, Share2, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${car.brand} ${car.model}`,
          text: `Посмотрите ${car.brand} ${car.model} в нашем каталоге`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Ссылка скопирована",
          description: "Ссылка скопирована в буфер обмена"
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="bg-white border-b border-auto-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-auto-gray-900 truncate">
              {car.brand} {car.model}
            </h1>
            <p className="text-auto-gray-600 mt-1 text-sm sm:text-base truncate">
              {car.year} • {car.engine.type} {car.engine.displacement}л • {car.engine.power} л.с. • {car.transmission.type}
            </p>
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 mt-4 md:mt-0 w-full sm:w-auto overflow-x-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 flex items-center w-full sm:w-auto justify-center"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              <span className="truncate">Поделиться</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex-shrink-0 flex items-center w-full sm:w-auto justify-center",
                isFavorite && "text-red-500 hover:text-red-700 border-red-500 hover:bg-red-50"
              )}
              onClick={() => toggleFavorite(car.id)}
            >
              <Heart 
                className="h-4 w-4 mr-1" 
                fill={isFavorite ? "currentColor" : "none"} 
              />
              <span className="truncate">
                {isFavorite ? "В избранном" : "В избранное"}
              </span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex-shrink-0 flex items-center w-full sm:w-auto justify-center",
                isInCompare && "text-auto-blue-600 hover:text-auto-blue-700 border-auto-blue-600 hover:bg-auto-blue-50"
              )}
              onClick={() => toggleCompare(car.id)}
            >
              <Menu className="h-4 w-4 mr-1" />
              <span className="truncate">
                {isInCompare ? "В сравнении" : "Сравнить"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarTitle;
