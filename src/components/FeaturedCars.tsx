
import { useEffect, useState } from "react";
import { Car } from "@/types/car";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedCarsProps {
  cars: Car[];
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const FeaturedCars = ({ 
  cars, 
  title, 
  subtitle, 
  loading = false, 
  error = null,
  onRetry 
}: FeaturedCarsProps) => {
  const [visibleCount, setVisibleCount] = useState(4);
  const isMobile = useIsMobile();

  // Determine how many cards to show based on viewport
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(1);
      } else if (width < 768) {
        setVisibleCount(2);
      } else if (width < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate number of items to show based on viewport size
  const getCarouselOptions = () => {
    return {
      align: "start" as const,
      loop: false,
      skipSnaps: false,
      startIndex: 0,
    };
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-auto-gray-900">{title}</h2>
            {subtitle && <p className="text-auto-gray-600 mt-1">{subtitle}</p>}
          </div>
        </div>
        
        {error && <ErrorState message={error} onRetry={onRetry} />}
        
        {loading ? (
          <LoadingState count={visibleCount} type="card" />
        ) : !error && cars.length === 0 ? (
          <LoadingState count={visibleCount} type="card" />
        ) : !error && (
          <Carousel
            opts={getCarouselOptions()}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {cars.map((car) => (
                <CarouselItem 
                  key={car.id} 
                  className={`pl-4 ${
                    isMobile 
                      ? "basis-full" 
                      : visibleCount === 2 
                        ? "basis-1/2" 
                        : visibleCount === 3 
                          ? "basis-1/3" 
                          : "basis-1/4"
                  }`}
                >
                  <CarCard car={car} className="h-full" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious 
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white border-none"
            />
            <CarouselNext 
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white border-none"
            />
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default FeaturedCars;
