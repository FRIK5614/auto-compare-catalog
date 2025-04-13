
import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { CarImage } from "@/types/car";
import { cn } from "@/lib/utils";

interface CarImageGalleryProps {
  images: CarImage[] | null | undefined;
  carId: string;
  isNew?: boolean;
}

const CarImageGallery: React.FC<CarImageGalleryProps> = ({ images, carId, isNew }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  
  // Ensure we have images to display
  const displayImages = images && Array.isArray(images) && images.length > 0 
    ? images 
    : [{ 
        id: "default", 
        url: "/placeholder.svg", 
        alt: "Изображение автомобиля" 
      }];
  
  const hasMultipleImages = displayImages.length > 1;
  
  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };
  
  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };
  
  // Touch handlers for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!touchStartX.current || !touchEndX.current) return;
    
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // Min swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left - show next image
        setCurrentIndex(prev => (prev === displayImages.length - 1 ? 0 : prev + 1));
      } else {
        // Swipe right - show previous image
        setCurrentIndex(prev => (prev === 0 ? displayImages.length - 1 : prev - 1));
      }
    }
    
    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
  };
  
  const currentImage = displayImages[currentIndex];
  
  return (
    <Link to={`/car/${carId}`} className="block relative group overflow-hidden rounded-t-lg">
      <div 
        className="relative aspect-[4/3] overflow-hidden bg-auto-gray-100"
        onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
        onTouchMove={hasMultipleImages ? handleTouchMove : undefined}
        onTouchEnd={hasMultipleImages ? handleTouchEnd : undefined}
      >
        <img 
          src={currentImage.url} 
          alt={currentImage.alt || "Изображение автомобиля"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          draggable="false"
        />
        
        {/* Страна происхождения */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Компоненты для отображения маркеров будут вставлены здесь */}
        </div>
        
        {/* Новинка */}
        {isNew && (
          <Badge className="absolute top-12 left-3 bg-auto-blue-600">
            Новинка
          </Badge>
        )}
        
        {/* Navigation buttons */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevClick}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4 text-auto-gray-700" />
            </button>
            <button
              onClick={handleNextClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
            >
              <ChevronRight className="h-4 w-4 text-auto-gray-700" />
            </button>
          </>
        )}
        
        {/* Indicator dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <div className="flex space-x-1 bg-black/20 rounded-full px-2 py-1">
              {displayImages.map((_, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "rounded-full transition-all duration-200",
                    idx === currentIndex 
                      ? "w-2 h-2 bg-white" 
                      : "w-1.5 h-1.5 bg-white/50"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CarImageGallery;
