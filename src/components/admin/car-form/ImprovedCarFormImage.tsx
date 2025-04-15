
import React from 'react';
import { Car, CarImage } from '@/types/car';
import { ImageFormTabs } from './image-form';

interface ImprovedCarFormImageProps {
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  car: Car;
  handleAddImage?: (url: string) => void;
  handleRemoveImage?: (index: number) => void;
  images: CarImage[];
}

const ImprovedCarFormImage: React.FC<ImprovedCarFormImageProps> = ({
  imagePreview,
  handleImageUpload,
  car,
  handleAddImage,
  handleRemoveImage,
  images
}) => {
  return (
    <div className="col-span-1">
      <h3 className="text-lg font-medium mb-4">Изображения ({images?.length || 0})</h3>
      
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

export default ImprovedCarFormImage;
