
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, BarChart2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/formatters";
import { Car } from "@/types/car";

interface CarPriceAndActionsProps {
  car: Car;
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => void;
  isFavorite: boolean;
  isInCompare: boolean;
}

const CarPriceAndActions = ({ 
  car, 
  toggleFavorite, 
  toggleCompare, 
  isFavorite, 
  isInCompare 
}: CarPriceAndActionsProps) => {
  return (
    <div className="w-full">
      <div className="mb-3">
        {car.price.discount ? (
          <div className="flex flex-col">
            <span className="text-xl font-bold text-auto-blue-700">
              {formatPrice(car.price.base - car.price.discount)}
            </span>
            <span className="text-sm text-auto-gray-500 line-through">
              {formatPrice(car.price.base)}
            </span>
          </div>
        ) : (
          <span className="text-xl font-bold text-auto-blue-700">
            {formatPrice(car.price.base)}
          </span>
        )}
      </div>
      
      <div className="flex space-x-2">
        <Button 
          asChild
          variant="blue" 
          className="flex-1"
        >
          <Link to={`/car/${car.id}`}>
            <Info className="mr-2 h-4 w-4" />
            Подробнее
          </Link>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "text-auto-gray-700 hover:text-auto-red-500",
            isFavorite && "text-red-500 hover:text-red-700 border-red-500 hover:bg-red-50"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(car.id);
          }}
          data-no-card-click="true"
        >
          <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "text-auto-gray-700 hover:text-auto-blue-600",
            isInCompare && "text-auto-blue-600 hover:text-auto-blue-700 border-auto-blue-600 hover:bg-auto-blue-50"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(car.id);
          }}
          data-no-card-click="true"
        >
          <BarChart2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CarPriceAndActions;
