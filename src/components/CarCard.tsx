
import { useState } from "react";
import { Link } from "react-router-dom";
import { Car } from "@/types/car";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, BarChart2, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { useCars } from "@/hooks/useCars";
import { cn } from "@/lib/utils";

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
  
  const currentImage = car.images[imageIndex];
  const touchStartX = useState<number | null>(null);
  
  const goToNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setImageIndex((prev) => (prev + 1) % car.images.length);
  };
  
  const goToPrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX[1](e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX[0] === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX[0] - touchEndX;
    
    // Detect swipe (threshold of 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next image
        goToNextImage();
      } else {
        // Swipe right - previous image
        goToPrevImage();
      }
    }
    
    touchStartX[1](null);
  };

  const showImageControls = car.images.length > 1;

  return (
    <Card className={cn("overflow-hidden group h-full flex flex-col", className)}>
      <div className="relative overflow-hidden h-48">
        <Link to={`/car/${car.id}`} className="block h-full w-full relative">
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
          
          {showImageControls && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-1 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 text-gray-700" />
              </button>
              
              <button
                onClick={goToNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-1 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 text-gray-700" />
              </button>
            </>
          )}
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
        
        <div className="absolute bottom-0 left-0 w-full p-2 flex justify-between items-center bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex space-x-1">
            {car.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setImageIndex(idx);
                }}
                className={`w-2 h-2 rounded-full ${
                  idx === imageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
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
                isFavorite(car.id) && "text-red-500 hover:text-red-700 border-red-500 hover:bg-red-50"
              )}
              onClick={() => toggleFavorite(car.id)}
            >
              <Heart className="h-5 w-5" fill={isFavorite(car.id) ? "currentColor" : "none"} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "text-auto-gray-700 hover:text-auto-blue-600",
                isInCompare(car.id) && "text-auto-blue-600 hover:text-auto-blue-700 border-auto-blue-600 hover:bg-auto-blue-50"
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
