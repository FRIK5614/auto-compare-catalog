
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { CarImage } from "@/types/car";

interface CarImageGalleryProps {
  images: CarImage[];
  carId: string;
  isNew?: boolean;
}

const CarImageGallery: React.FC<CarImageGalleryProps> = ({ images, carId, isNew }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Убедимся, что у нас есть изображения для отображения
  const displayImages = images && images.length > 0 ? images : [{ 
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
  
  const currentImage = displayImages[currentIndex];
  
  return (
    <Link to={`/car/${carId}`} className="block relative group overflow-hidden rounded-t-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-auto-gray-100">
        <img 
          src={currentImage.url} 
          alt={currentImage.alt || "Изображение автомобиля"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Помещаем маркер страны в верхнем левом углу */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Компоненты для отображения маркеров будут вставлены здесь */}
        </div>
        
        {/* Помещаем маркер "Новинка" во верхнем левом углу */}
        {isNew && (
          <Badge className="absolute top-12 left-3 bg-auto-blue-600">
            Новинка
          </Badge>
        )}
        
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevClick}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4 text-auto-gray-700" />
            </button>
            <button
              onClick={handleNextClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4 text-auto-gray-700" />
            </button>
          </>
        )}
        
        {/* Индикаторы изображений для мобильных устройств */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <div className="flex space-x-1">
              {displayImages.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
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
