
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CarImage } from '@/types/car';
import { X, Upload, Link as LinkIcon, Plus } from 'lucide-react';

interface GalleryTabProps {
  images: CarImage[];
  handleRemoveImage?: (index: number) => void;
  setUploadMethod: (method: string) => void;
}

const GalleryTab: React.FC<GalleryTabProps> = ({
  images,
  handleRemoveImage,
  setUploadMethod
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {images && images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={image.id || index} className="relative group">
                  <img
                    src={image.url}
                    alt={image.alt || `Изображение ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md border"
                  />
                  {handleRemoveImage && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add new image button */}
              <div
                className="h-24 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                onClick={() => setUploadMethod('url')}
              >
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-muted/50 rounded-md">
              <p className="text-muted-foreground mb-4">Нет загруженных изображений</p>
              <Button 
                type="button"
                onClick={() => setUploadMethod('upload')}
                className="mr-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                Загрузить
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => setUploadMethod('url')}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Добавить по ссылке
              </Button>
            </div>
          )}
          
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-xs text-muted-foreground">
              Совет: Первое изображение в галерее будет использоваться как основное изображение автомобиля
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GalleryTab;
