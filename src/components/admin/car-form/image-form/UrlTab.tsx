
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UrlTabProps {
  handleAddImage?: (url: string) => void;
}

const UrlTab: React.FC<UrlTabProps> = ({
  handleAddImage
}) => {
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
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

  return (
    <Card>
      <CardContent className="pt-6">
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
      </CardContent>
    </Card>
  );
};

export default UrlTab;
