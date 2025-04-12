
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarImage } from "@/types/car";

interface CarImageGalleryProps {
  images: CarImage[];
  isNew?: boolean;
}

const CarImageGallery: React.FC<CarImageGalleryProps> = ({ images, isNew }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Убедимся, что у нас есть изображения для отображения
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

  // Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;
    const threshold = 100; // Min swipe distance

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
    touchEndX.current = null;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
        {/* Маркер "Новинка" */}
        {isNew && (
          <Badge className="absolute top-4 left-4 z-10 bg-auto-blue-600">Новинка</Badge>
        )}

        <img
          src={displayImages[activeImageIndex].url}
          alt={displayImages[activeImageIndex].alt || "Изображение автомобиля"}
          className="w-full h-full object-cover"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Кнопки навигации - показывать только если больше одного изображения */}
        {displayImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-auto-gray-700 rounded-full"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-auto-gray-700 rounded-full"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Миниатюры снизу - показывать только если больше одного изображения */}
      {displayImages.length > 1 && (
        <div className="p-4 flex space-x-2 overflow-x-auto">
          {displayImages.map((image, index) => (
            <button
              key={image.id || index}
              className={`w-20 h-20 rounded ${
                activeImageIndex === index
                  ? "ring-2 ring-auto-blue-600"
                  : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => setActiveImageIndex(index)}
            >
              <img
                src={image.url}
                alt={image.alt || `Изображение ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarImageGallery;
