
import { useState } from 'react';
import { Car, CarImage } from '@/types/car';
import { v4 as uuidv4 } from 'uuid';

export const useImageInitialization = (setImagePreview: (preview: string | null) => void) => {
  const [images, setImages] = useState<CarImage[]>([]);

  // Initialize images from car
  const initializeImagesFromCar = (car: Car) => {
    console.log("Initializing images from car:", car.id);
    console.log("Car images:", car.images);
    console.log("Car image_url:", car.image_url);
    
    if (car.images && car.images.length > 0) {
      setImages(car.images);
      setImagePreview(car.images[0].url);
      console.log("Set images from car.images:", car.images.length);
    } else if (car.image_url) {
      setImagePreview(car.image_url);
      
      // If there's an image_url but no images array, initialize the images array
      if (!car.images || car.images.length === 0) {
        const initialImage = {
          id: uuidv4(),
          url: car.image_url,
          alt: `${car.brand} ${car.model}`
        };
        setImages([initialImage]);
        console.log("Set images from car.image_url:", [initialImage]);
      }
    }
  };

  return {
    images,
    setImages,
    initializeImagesFromCar
  };
};
