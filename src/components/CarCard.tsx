
import { useState } from "react";
import { Link } from "react-router-dom";
import { Car } from "@/types/car";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, BarChart2, Info } from "lucide-react";
import { useCars } from "@/hooks/useCars";
import { cn } from "@/lib/utils";
import { useEffect, useRef, TouchEvent } from "react";

interface CarCardProps {
  car: Car;
  className?: string;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};

const CarCard = ({ car, className }: CarCardProps) => {
  const [imageIndex, setImageIndex] = useState(0);
  const { toggleFavorite, toggleCompare, isFavorite, isInCompare } = useCars();
  const touchStartX = useRef<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const currentImage = car.images[imageIndex];
  
  // Handle swipe gestures for image navigation
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX.current;
    
    // If swipe distance is significant (more than 50px)
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe right (previous image)
        setImageIndex(prev => (prev === 0 ? car.images.length - 1 : prev - 1));
      } else {
        // Swipe left (next image)
        setImageIndex(prev => (prev === car.images.length - 1 ? 0 : prev + 1));
      }
    }
    
    touchStartX.current = null;
  };

  // Add visual indicator for multiple images if there's more than one
  const hasMultipleImages = car.images.length > 1;
  
  // Safe check for isFavorite and isInCompare functions
  const isFavoriteCard = typeof isFavorite === 'function' ? isFavorite(car.id) : false;
  const isInCompareCard = typeof isInCompare === 'function' ? isInCompare(car.id) : false;
  
  return (
    <Card className={cn("overflow-hidden group h-full flex flex-col", className)}>
      <div 
        ref={imageRef}
        className="relative overflow-hidden h-48"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Link to={`/car/${car.id}`} className="block h-full w-full relative">
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {car.isNew && (
            <Badge className="bg-auto-blue-600">Новинка</Badge>
          )}
          
          {car.country && (
            <Badge className="bg-green-600">{car.country}</Badge>
          )}
        </div>
        
        {car.price.discount && car.price.discount > 0 && (
          <Badge variant="outline" className="absolute top-3 right-3 bg-white text-red-600 border-red-600">
            Скидка {formatPrice(car.price.discount)}
          </Badge>
        )}
        
        {/* Image indicator dots for multiple images */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {car.images.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "w-2 h-2 rounded-full",
                  idx === imageIndex ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>
      
      <CardContent className="flex-1 p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-auto-gray-900 hover:text-auto-blue-600 transition-colors">
            <Link to={`/car/${car.id}`}>
              {car.brand} {car.model}
            </Link>
          </h3>
          <p className="text-auto-gray-500 text-sm">
            {car.year} • {car.engine.fuelType} • {car.bodyType}
          </p>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <span className="text-auto-gray-600">Двигатель:</span>
          </div>
          <div className="text-right">
            <span className="text-auto-gray-900 font-medium">
              {car.engine.displacement} л, {car.engine.power} л.с.
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-auto-gray-600">КПП:</span>
          </div>
          <div className="text-right">
            <span className="text-auto-gray-900 font-medium">
              {car.transmission.type}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-auto-gray-600">Привод:</span>
          </div>
          <div className="text-right">
            <span className="text-auto-gray-900 font-medium">
              {car.drivetrain}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto">
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
              variant="default" 
              className="flex-1 bg-auto-blue-600 hover:bg-auto-blue-700"
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
                isFavoriteCard && "text-red-500 hover:text-red-700 border-red-500 hover:bg-red-50"
              )}
              onClick={() => toggleFavorite(car.id)}
            >
              <Heart className="h-5 w-5" fill={isFavoriteCard ? "currentColor" : "none"} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "text-auto-gray-700 hover:text-auto-blue-600",
                isInCompareCard && "text-auto-blue-600 hover:text-auto-blue-700 border-auto-blue-600 hover:bg-auto-blue-50"
              )}
              onClick={() => toggleCompare(car.id)}
            >
              <BarChart2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
