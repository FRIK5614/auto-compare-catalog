
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarImage } from "@/types/car";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    ? images.map(img => ({
        ...img,
        url: img.url || "/placeholder.svg", // Ensure URL is never undefined
        alt: img.alt || "Изображение автомобиля"
      }))
    : [defaultImage]; // Fallback to default image

  console.log("CarImageGallery: Отображение изображений:", displayImages.length);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="relative">
        {/* "Новинка" badge */}
        {isNew && (
          <Badge className="absolute top-4 left-4 z-10 bg-auto-blue-600">Новинка</Badge>
        )}

        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ 
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
          }}
          onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
          className="h-[300px] sm:h-[400px] md:h-[500px]"
        >
          {displayImages.map((image, index) => (
            <SwiperSlide key={image.id || `image-${index}`}>
              <img
                src={image.url}
                alt={image.alt || `Изображение ${index + 1}`}
                className="w-full h-full object-cover"
                draggable="false"
              />
            </SwiperSlide>
          ))}
          
          {/* Custom navigation buttons - show only if more than one image */}
          {displayImages.length > 1 && (
            <>
              <button 
                className="swiper-button-prev bg-white/80 hover:bg-white text-auto-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow-sm absolute top-1/2 left-2 z-10 transform -translate-y-1/2"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                className="swiper-button-next bg-white/80 hover:bg-white text-auto-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow-sm absolute top-1/2 right-2 z-10 transform -translate-y-1/2"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </Swiper>
      </div>

      {/* Thumbnails - shown only if more than one image */}
      {displayImages.length > 1 && (
        <div className="p-4">
          <Swiper
            spaceBetween={8}
            slidesPerView="auto"
            className="thumbnails-swiper"
          >
            {displayImages.map((image, index) => (
              <SwiperSlide 
                key={`thumb-${image.id || index}`}
                className="w-20 h-20 cursor-pointer"
                onClick={() => setActiveImageIndex(index)}
              >
                <div 
                  className={`w-full h-full border-2 rounded overflow-hidden ${
                    activeImageIndex === index 
                      ? 'border-auto-blue-600 shadow-md' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `Миниатюра ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable="false"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default CarImageGallery;
