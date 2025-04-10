
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Car } from '@/types/car';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Plus } from 'lucide-react';

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
  const [uploadMethod, setUploadMethod] = useState<string>('upload');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const validateImageUrl = (url: string): boolean => {
    if (!url.trim()) {
      setError('URL не может быть пустым');
      return false;
    }
    
    try {
      new URL(url);
      setError(null);
      return true;
    } catch (e) {
      setError('Неверный формат URL');
      return false;
    }
  };

  const handleAddImageByUrl = () => {
    if (validateImageUrl(newImageUrl) && handleAddImage) {
      handleAddImage(newImageUrl);
      setNewImageUrl('');
    }
  };

  const images = car.images || [];
  const mainImageUrl = car.image_url || (images.length > 0 ? images[0].url : null);

  return (
    <div className="col-span-1">
      <h3 className="text-lg font-medium mb-4">Изображения</h3>
      
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
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center">
                {imagePreview ? (
                  <div className="relative w-full mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-64 w-full object-contain rounded-md border bg-muted"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        if (handleRemoveImage) handleRemoveImage(0);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-md flex items-center justify-center h-64 w-full bg-muted mb-4">
                    <p className="text-muted-foreground">Предпросмотр изображения</p>
                  </div>
                )}
                
                <Label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Нажмите для загрузки</span> или перетащите файл
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG или WEBP (макс. 10MB)</p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="url">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                {mainImageUrl && (
                  <div className="relative w-full mb-4">
                    <img
                      src={mainImageUrl}
                      alt="Preview"
                      className="h-64 w-full object-contain rounded-md border bg-muted"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="image-url">URL изображения</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image-url"
                      placeholder="https://example.com/image.jpg"
                      value={newImageUrl}
                      onChange={(e) => {
                        setNewImageUrl(e.target.value);
                        setError(null);
                      }}
                    />
                    <Button type="button" onClick={handleAddImageByUrl}>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить
                    </Button>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <p className="text-xs text-muted-foreground">
                    Ссылка будет сохранена без загрузки изображения на сервер
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gallery">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={image.alt || `Изображение ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md border"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            if (handleRemoveImage) handleRemoveImage(index);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
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
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    Совет: Первое изображение в галерее будет использоваться как основное изображение автомобиля
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarFormImage;
