
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, CarImage } from '@/types/car';
import { Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import UploadTab from './UploadTab';
import UrlTab from './UrlTab';
import GalleryTab from './GalleryTab';

interface ImageFormTabsProps {
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  car: Car;
  handleAddImage?: (url: string) => void;
  handleRemoveImage?: (index: number) => void;
  images: CarImage[];
}

const ImageFormTabs: React.FC<ImageFormTabsProps> = ({
  imagePreview,
  handleImageUpload,
  car,
  handleAddImage,
  handleRemoveImage,
  images
}) => {
  const [uploadMethod, setUploadMethod] = useState<string>('upload');

  return (
    <Tabs defaultValue={uploadMethod} onValueChange={setUploadMethod}>
      <TabsList className="mb-4 w-full">
        <TabsTrigger value="upload" className="flex-1">
          <Upload className="h-4 w-4 mr-2" />
          Загрузить
        </TabsTrigger>
        <TabsTrigger value="url" className="flex-1">
          <LinkIcon className="h-4 w-4 mr-2" />
          По ссылке
        </TabsTrigger>
        <TabsTrigger value="gallery" className="flex-1">
          <ImageIcon className="h-4 w-4 mr-2" />
          Галерея
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload">
        <UploadTab 
          imagePreview={imagePreview} 
          handleImageUpload={handleImageUpload} 
        />
      </TabsContent>
      
      <TabsContent value="url">
        <UrlTab 
          handleAddImage={handleAddImage} 
        />
      </TabsContent>
      
      <TabsContent value="gallery">
        <GalleryTab 
          images={images} 
          handleRemoveImage={handleRemoveImage}
          setUploadMethod={setUploadMethod}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ImageFormTabs;
