
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
  CarouselApi,
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
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Update scroll buttons state when the carousel API changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    // Initial check
    onSelect();

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

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
          
          {/* Navigation buttons moved next to the title */}
          {!loading && !error && cars.length > 0 && (
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
                className="rounded-full h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 text-white border-none"
                aria-label="Previous car"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
                className="rounded-full h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 text-white border-none"
                aria-label="Next car"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
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
            setApi={setApi}
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
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default FeaturedCars;
