
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Car } from "@/types/car";
import { cn } from "@/lib/utils";
import { useCars } from "@/hooks/useCars";

// Import our new components
import CarImageGallery from "./car-card/CarImageGallery";
import CarBasicInfo from "./car-card/CarBasicInfo";
import CarSpecifications from "./car-card/CarSpecifications";
import CarPriceAndActions from "./car-card/CarPriceAndActions";
import PriceDiscount from "./car-card/PriceDiscount";
import CountryBadge from "./car-card/CountryBadge";

interface CarCardProps {
  car: Car;
  className?: string;
}

const CarCard = ({ car, className }: CarCardProps) => {
  const { toggleFavorite, toggleCompare, isFavorite, isInCompare } = useCars();
  
  // Safe check for isFavorite and isInCompare functions
  const isFavoriteCard = typeof isFavorite === 'function' ? isFavorite(car.id) : false;
  const isInCompareCard = typeof isInCompare === 'function' ? isInCompare(car.id) : false;
  
  // Check if click is on the card but not on a child with specified classes
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements or sort options
    const target = e.target as HTMLElement;
    const isInteractiveElement = 
      target.closest('[role="combobox"]') || 
      target.closest('[role="option"]') ||
      target.closest('.select-dropdown') ||
      target.closest('[data-radix-select-trigger]') ||
      target.closest('[data-radix-select-content]') ||
      target.closest('[data-radix-select-item]');
    
    if (isInteractiveElement) {
      // Don't process the card click
      e.stopPropagation();
      e.preventDefault();
      return;
    }
  };
  
  return (
    <Card 
      className={cn("overflow-hidden group h-full flex flex-col", className)}
      onClick={handleCardClick}
    >
      <div className="relative">
        <CarImageGallery 
          images={car.images} 
          isNew={car.isNew} 
          carId={car.id} 
        />
        <PriceDiscount discount={car.price.discount || 0} />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <CountryBadge country={car.country} />
        </div>
      </div>
      
      <CardContent className="flex-1 p-4">
        <CarBasicInfo car={car} />
        <CarSpecifications car={car} />
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto">
        <CarPriceAndActions 
          car={car}
          toggleFavorite={toggleFavorite}
          toggleCompare={toggleCompare}
          isFavorite={isFavoriteCard}
          isInCompare={isInCompareCard}
        />
      </CardFooter>
    </Card>
  );
};

export default CarCard;
