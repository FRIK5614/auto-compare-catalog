
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Car } from '@/types/car';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Plus, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      toast({
        title: "Изображение добавлено",
        description: "Изображение добавлено в галерею"
      });
    }
  };

  const handlePasteUrl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setNewImageUrl(text.trim());
        setError(null);
        urlInputRef.current?.focus();
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось вставить URL из буфера обмена"
      });
    }
  };

  // Обновлено для поддержки мультизагрузки
  const handleMultipleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && handleImageUpload) {
      handleImageUpload(e);
      
      // Show success message
      toast({
        title: "Изображения загружены",
        description: `Добавлено ${e.target.files.length} изображений`
      });
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const images = car.images || [];
  const mainImageUrl = car.image_url || (images.length > 0 ? images[0].url : null);
  
  console.log("CarFormImage: images.length =", images.length);

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
            Галерея ({images.length})
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
                    {handleRemoveImage && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveImage(0)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
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
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={handleMultipleFileUpload}
                  />
                </Label>
                
                <div className="w-full mt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Выбрать несколько файлов
                  </Button>
                </div>
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
                    <div className="relative flex-1">
                      <Input
                        id="image-url"
                        ref={urlInputRef}
                        placeholder="https://example.com/image.jpg"
                        value={newImageUrl}
                        onChange={(e) => {
                          setNewImageUrl(e.target.value);
                          setError(null);
                        }}
                        className="pr-10"
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        onClick={handlePasteUrl}
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
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
                {images.length > 0 ? (
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarFormImage;
