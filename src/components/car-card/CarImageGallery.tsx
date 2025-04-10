
import { useState, useRef, TouchEvent } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarImage } from "@/types/car";
import { Link } from "react-router-dom";

interface CarImageGalleryProps {
  images: CarImage[];
  isNew: boolean;
  carId: string;
}

const CarImageGallery = ({ images, isNew, carId }: CarImageGalleryProps) => {
  const [imageIndex, setImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const currentImage = images[imageIndex];
  const hasMultipleImages = images.length > 1;
  
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
        setImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
      } else {
        // Swipe left (next image)
        setImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
      }
    }
    
    touchStartX.current = null;
  };

  const handlePrevImage = () => {
    setImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      ref={imageRef}
      className="relative overflow-hidden h-48"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Link to={`/car/${carId}`} className="block h-full w-full relative">
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {isNew && (
          <Badge className="bg-auto-blue-600">Новинка</Badge>
        )}
      </div>
      
      {hasMultipleImages && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full ${
                idx === imageIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

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
    </div>
  );
};

export default CarImageGallery;
