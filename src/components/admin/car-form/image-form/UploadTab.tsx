
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface UploadTabProps {
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadTab: React.FC<UploadTabProps> = ({
  imagePreview,
  handleImageUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
              onChange={handleImageUpload}
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
  );
};

export default UploadTab;
