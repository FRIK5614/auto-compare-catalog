
import React from 'react';
import { Car } from '@/types/car';
import { ImageFormTabs } from './image-form';

interface CarFormImageProps {
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  car: Car;
  handleImageUrlChange?: (url: string) => void;
  handleAddImage?: (url: string) => void;
  handleRemoveImage?: (index: number) => void;
}

const CarFormImage: React.FC<CarFormImageProps> = ({
  imagePreview,
  handleImageUpload,
  car,
  handleImageUrlChange,
  handleAddImage,
  handleRemoveImage
}) => {
  const images = car.images || [];
  
  return (
    <div className="col-span-1">
      <h3 className="text-lg font-medium mb-4">Изображения ({images.length || 0})</h3>
      
      <ImageFormTabs
        imagePreview={imagePreview}
        handleImageUpload={handleImageUpload}
        car={car}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
        images={images}
      />
    </div>
  );
};

export default CarFormImage;
