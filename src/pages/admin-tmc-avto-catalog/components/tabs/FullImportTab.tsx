
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FullImportTabProps {
  importAllCars: (params?: any) => Promise<any>;
  loading: boolean;
  blockedSources: string[];
}

export const FullImportTab: React.FC<FullImportTabProps> = ({ importAllCars, loading, blockedSources }) => {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  
  const handleFullImport = async () => {
    setIsImporting(true);
    try {
      await importAllCars({
        onSuccess: (data: any) => {
          toast({
            title: 'Импорт завершен',
            description: `Успешно импортировано ${data.length} автомобилей`,
          });
        }
      });
    } catch (error) {
      console.error('Error importing all cars:', error);
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Полный импорт автомобилей</CardTitle>
        <CardDescription>
          Импортировать все доступные автомобили из всех источников
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-4 rounded-md mb-4">
          <h3 className="font-semibold mb-2">Предупреждение</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Полный импорт может занять продолжительное время в зависимости от количества автомобилей в каталоге.
            Процесс будет выполняться в фоновом режиме.
          </p>
          <p className="text-sm text-muted-foreground">
            Убедитесь, что вы не закрываете эту страницу до завершения импорта.
          </p>
        </div>
        
        {blockedSources.length > 0 && (
          <div className="bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 p-4 rounded-md mb-4">
            <h3 className="font-semibold flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              Заблокированные источники
            </h3>
            <p className="text-sm mt-1">
              Некоторые источники блокируют доступ к своим данным:
              {blockedSources.map(source => {
                const sourceNames = {
                  'china': 'Китай',
                  'japan': 'Япония',
                  'korea': 'Корея'
                };
                return ` ${sourceNames[source as keyof typeof sourceNames] || source}`;
              }).join(',')}
            </p>
          </div>
        )}
        
        <Button 
          onClick={handleFullImport}
          disabled={isImporting || loading}
          className="w-full"
        >
          {isImporting || loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Импорт выполняется...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Начать полный импорт
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
