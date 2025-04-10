
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Link as LinkIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CarUrlFetcherProps {
  onFetch: (url: string) => Promise<void>;
  onSkip: () => void;
  loading: boolean;
}

const CarUrlFetcher: React.FC<CarUrlFetcherProps> = ({ onFetch, onSkip, loading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Пожалуйста, введите URL');
      return;
    }
    
    try {
      new URL(url);
      setError(null);
      await onFetch(url);
    } catch (e) {
      setError('Пожалуйста, введите корректный URL');
    }
  };

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Импорт данных об автомобиле</CardTitle>
          <CardDescription>
            Укажите URL страницы автомобиля для импорта данных
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError(null);
                  }}
                  placeholder="https://catalog.tmcavto.ru/car/123"
                  disabled={loading}
                />
              </div>
              
              <p className="text-xs text-muted-foreground">
                Поддерживаются URL с сайтов catalog.tmcavto.ru и других автомобильных каталогов
              </p>
            </div>
          </form>
          
          <div className="mt-6 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => setUrl('https://catalog.tmcavto.ru/china')}
              >
                Китайские авто
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => setUrl('https://catalog.tmcavto.ru/japan')}
              >
                Японские авто
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => setUrl('https://catalog.tmcavto.ru/korea')}
              >
                Корейские авто
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => setUrl('https://catalog.tmcavto.ru')}
              >
                Все автомобили
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" type="button" onClick={onSkip}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Пропустить
          </Button>
          <Button type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Загрузка...
              </>
            ) : (
              'Импортировать'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CarUrlFetcher;
