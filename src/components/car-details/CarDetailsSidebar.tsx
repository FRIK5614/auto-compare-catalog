
import React from "react";
import { Button } from "@/components/ui/button";
import { Car } from "@/types/car";
import { Heart, BarChart2, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";
import PurchaseRequestForm from "@/components/PurchaseRequestForm";

interface CarDetailsSidebarProps {
  car: Car;
  isFavorite: boolean;
  isInCompare: boolean;
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => void;
}

const CarDetailsSidebar: React.FC<CarDetailsSidebarProps> = ({
  car,
  isFavorite,
  isInCompare,
  toggleFavorite,
  toggleCompare
}) => {
  const { toast } = useToast();

  const handleCallClick = () => {
    navigator.clipboard.writeText("+7 (495) 123-45-67")
      .then(() => {
        toast({
          title: "Номер телефона скопирован",
          description: "+7 (495) 123-45-67",
        });
      })
      .catch(() => {
        window.location.href = "tel:+74951234567";
      });
  };

  return (
    <div className="space-y-6">
      {/* Price Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-4">
          <div>
            {car.price.discount ? (
              <>
                <p className="text-3xl font-bold text-auto-blue-700">
                  {formatPrice(car.price.base - car.price.discount)}
                </p>
                <p className="text-auto-gray-500 line-through">
                  {formatPrice(car.price.base)}
                </p>
                <p className="text-red-600 text-sm font-medium">
                  Выгода: {formatPrice(car.price.discount)}
                </p>
              </>
            ) : (
              <p className="text-3xl font-bold text-auto-blue-700">
                {formatPrice(car.price.base)}
              </p>
            )}
          </div>
          
          <div className="pt-4 border-t border-auto-gray-200">
            <Button 
              className="w-full mb-3 bg-auto-blue-600 hover:bg-auto-blue-700 text-base"
              onClick={handleCallClick}
            >
              <Phone className="mr-2 h-5 w-5" />
              Позвонить
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className={cn(
                  "flex-1",
                  isFavorite && "text-red-500 hover:text-red-700 border-red-500 hover:bg-red-50"
                )}
                onClick={() => toggleFavorite(car.id)}
              >
                <Heart 
                  className="mr-2 h-5 w-5" 
                  fill={isFavorite ? "currentColor" : "none"} 
                />
                В избранное
              </Button>
              
              <Button
                variant="outline"
                className={cn(
                  "flex-1",
                  isInCompare && "text-auto-blue-600 hover:text-auto-blue-700 border-auto-blue-600 hover:bg-auto-blue-50"
                )}
                onClick={() => toggleCompare(car.id)}
              >
                <BarChart2 className="mr-2 h-5 w-5" />
                Сравнить
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Request Form */}
      <div className="flex justify-center items-center w-full">
        <PurchaseRequestForm car={car} />
      </div>
      
      {/* Colors */}
      {car.colors && car.colors.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Доступные цвета</h3>
          <div className="flex flex-wrap gap-2">
            {car.colors.map(color => (
              <div 
                key={color} 
                className="flex flex-col items-center"
              >
                <div 
                  className="w-10 h-10 rounded-full border border-auto-gray-200 mb-1"
                  style={{ 
                    backgroundColor: 
                      color.toLowerCase() === "white" ? "#ffffff" :
                      color.toLowerCase() === "black" ? "#000000" :
                      color.toLowerCase() === "silver" ? "#C0C0C0" :
                      color.toLowerCase() === "red" ? "#FF0000" :
                      color.toLowerCase() === "blue" ? "#0000FF" :
                      color.toLowerCase() === "gray" ? "#808080" : 
                      color
                  }}
                ></div>
                <span className="text-xs text-auto-gray-600">{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailsSidebar;
