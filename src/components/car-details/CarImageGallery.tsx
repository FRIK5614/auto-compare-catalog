
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarImage } from "@/types/car";
import { cn } from "@/lib/utils";

interface CarImageGalleryProps {
  images: CarImage[];
  isNew?: boolean;
}

const CarImageGallery: React.FC<CarImageGalleryProps> = ({ images, isNew }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchMoveX = useRef<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Ensure we have images to display
  const displayImages = images && images.length > 0 ? images : [{ 
    id: "default", 
    url: "/placeholder.svg", 
    alt: "Изображение автомобиля" 
  }];

  console.log("CarImageGallery: Отображение изображений:", displayImages.length);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  // Swipe handlers for mobile & desktop
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e) {
      touchStartX.current = e.touches[0].clientX;
    } else {
      touchStartX.current = e.clientX;
      setIsDragging(true);
    }
    touchMoveX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartX.current === null) return;
    
    if ('touches' in e) {
      touchMoveX.current = e.touches[0].clientX;
    } else if (isDragging) {
      touchMoveX.current = e.clientX;
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchMoveX.current) {
      setIsDragging(false);
      return;
    }

    const diff = touchStartX.current - touchMoveX.current;
    const threshold = 50; // Min swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left - show next image
        handleNextImage();
      } else {
        // Swipe right - show previous image
        handlePrevImage();
      }
    }

    // Reset
    touchStartX.current = null;
    touchMoveX.current = null;
    setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div 
        ref={galleryRef}
        className="relative h-[300px] sm:h-[400px] md:h-[500px] select-none cursor-grab"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* "Новинка" badge */}
        {isNew && (
          <Badge className="absolute top-4 left-4 z-10 bg-auto-blue-600">Новинка</Badge>
        )}

        <img
          src={displayImages[activeImageIndex].url}
          alt={displayImages[activeImageIndex].alt || "Изображение автомобиля"}
          className="w-full h-full object-cover transition-transform duration-300"
          draggable="false"
        />

        {/* Navigation buttons - show only if more than one image */}
        {displayImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-auto-gray-700 rounded-full shadow-sm z-10"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-auto-gray-700 rounded-full shadow-sm z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Indicator dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center">
              <div className="flex space-x-2 bg-white/70 px-3 py-1.5 rounded-full">
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      activeImageIndex === index 
                        ? "bg-auto-blue-600 w-3" 
                        : "bg-gray-400"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(index);
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Thumbnails - shown only if more than one image */}
      {displayImages.length > 1 && (
        <div className="p-4 flex space-x-2 overflow-x-auto">
          {displayImages.map((image, index) => (
            <button
              key={image.id || index}
              className={cn(
                "w-20 h-20 rounded transition-all duration-200",
                activeImageIndex === index
                  ? "ring-2 ring-auto-blue-600 shadow-md"
                  : "opacity-70 hover:opacity-100"
              )}
              onClick={() => setActiveImageIndex(index)}
            >
              <img
                src={image.url}
                alt={image.alt || `Изображение ${index + 1}`}
                className="w-full h-full object-cover rounded"
                draggable="false"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarImageGallery;
