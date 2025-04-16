
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarImage } from "@/types/car";
import { cn } from "@/lib/utils";

interface CarImageGalleryProps {
  images: CarImage[] | null | undefined;
  isNew?: boolean;
}

const CarImageGallery: React.FC<CarImageGalleryProps> = ({ images, isNew }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Create a safe default image to use when no images are provided
  const defaultImage: CarImage = { 
    id: "default", 
    url: "/placeholder.svg", 
    alt: "Изображение автомобиля" 
  };

  // Safely convert input to an array, ensuring we always have at least one image
  const displayImages: CarImage[] = images && Array.isArray(images) && images.length > 0 
    ? images
        .filter(img => img && (img.url || img.id))
        .map(img => ({
          ...img,
          id: img.id || `img-${Math.random().toString(36).substr(2, 9)}`,
          url: img.url || "/placeholder.svg",
          alt: img.alt || "Изображение автомобиля"
        }))
    : [defaultImage];

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };

  // Handle carousel slide change - now correctly typed
  const handleSelect = (index: number) => {
    setActiveImageIndex(index);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="relative">
        {isNew && (
          <Badge className="absolute top-4 left-4 z-10 bg-auto-blue-600">Новинка</Badge>
        )}

        <Carousel 
          className="w-full"
          opts={{ startIndex: activeImageIndex }}
          setApi={(api) => {
            api?.on('select', () => {
              // Get the current selected index from the API
              const currentIndex = api.selectedScrollSnap();
              setActiveImageIndex(currentIndex);
            });
          }}
        >
          <CarouselContent>
            {displayImages.map((image, index) => (
              <CarouselItem key={image.id || `image-${index}`}>
                <div className="relative aspect-video md:aspect-[16/9] lg:aspect-[16/10] w-full h-full">
                  <img
                    src={image.url}
                    alt={image.alt || `Изображение ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable="false"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {displayImages.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-0 flex items-center">
                <CarouselPrevious 
                  className="relative h-9 w-9 rounded-full bg-white/70 hover:bg-white/90 -translate-x-1/2 border-0"
                  variant="outline"
                >
                  <ChevronLeft className="h-5 w-5 text-auto-gray-700" />
                </CarouselPrevious>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                <CarouselNext 
                  className="relative h-9 w-9 rounded-full bg-white/70 hover:bg-white/90 translate-x-1/2 border-0"
                  variant="outline"
                >
                  <ChevronRight className="h-5 w-5 text-auto-gray-700" />
                </CarouselNext>
              </div>
            </>
          )}
          
          {displayImages.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <div className="flex space-x-1 bg-black/20 rounded-full px-2 py-1">
                {displayImages.map((_, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "rounded-full transition-all duration-200",
                      activeImageIndex === idx 
                        ? "w-2 h-2 bg-white" 
                        : "w-1.5 h-1.5 bg-white/50"
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </Carousel>
      </div>

      {displayImages.length > 1 && (
        <div className="p-4 overflow-x-auto">
          <div className="flex space-x-2">
            {displayImages.map((image, index) => (
              <div 
                key={`thumb-${image.id || index}`}
                className={`w-20 h-20 flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  activeImageIndex === index 
                    ? 'ring-2 ring-auto-blue-600 ring-offset-1' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={image.url}
                  alt={image.alt || `Миниатюра ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                  draggable="false"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarImageGallery;
