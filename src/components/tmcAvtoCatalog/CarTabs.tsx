
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Car } from '@/hooks/tmcAvtoCatalog';
import { CarTable } from './CarTable';

interface CarTabsProps {
  cars: Car[];
  japanCars: Car[];
  koreaCars: Car[];
  chinaCars: Car[];
  blockedSources: string[];
  loading: boolean;
  handleImport: () => Promise<void>;
  showImportTab: boolean;
}

export const CarTabs = ({ 
  cars,
  japanCars,
  koreaCars,
  chinaCars,
  blockedSources,
  loading,
  handleImport,
  showImportTab
}: CarTabsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Общий каталог: {cars.length} авто</h3>
        {showImportTab && (
          <Button 
            onClick={handleImport} 
            disabled={loading}
            variant="outline"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Обновить данные
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Все ({cars.length})</TabsTrigger>
          <TabsTrigger value="japan" disabled={blockedSources.includes('japan')}>
            Япония ({japanCars.length})
            {blockedSources.includes('japan') && <ShieldAlert className="ml-1 h-3 w-3" />}
          </TabsTrigger>
          <TabsTrigger value="korea" disabled={blockedSources.includes('korea')}>
            Корея ({koreaCars.length})
            {blockedSources.includes('korea') && <ShieldAlert className="ml-1 h-3 w-3" />}
          </TabsTrigger>
          <TabsTrigger value="china" disabled={blockedSources.includes('china')}>
            Китай ({chinaCars.length})
            {blockedSources.includes('china') && <ShieldAlert className="ml-1 h-3 w-3" />}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <CarTable cars={cars} />
        </TabsContent>
        
        <TabsContent value="japan">
          {blockedSources.includes('japan') ? (
            <BlockedSourceAlert country="Японии" />
          ) : (
            <CarTable cars={japanCars} />
          )}
        </TabsContent>
        
        <TabsContent value="korea">
          {blockedSources.includes('korea') ? (
            <BlockedSourceAlert country="Кореи" />
          ) : (
            <CarTable cars={koreaCars} />
          )}
        </TabsContent>
        
        <TabsContent value="china">
          {blockedSources.includes('china') ? (
            <BlockedSourceAlert country="Китая" />
          ) : (
            <CarTable cars={chinaCars} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const BlockedSourceAlert = ({ country }: { country: string }) => (
  <Alert variant="destructive" className="mt-4">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>Источник заблокирован</AlertTitle>
    <AlertDescription>
      Сайт блокирует доступ к автомобилям из {country}. Попробуйте позже.
    </AlertDescription>
  </Alert>
);
