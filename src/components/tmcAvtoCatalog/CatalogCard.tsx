
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertsPanel } from './AlertsPanel';

interface CatalogCardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showImportTab: boolean;
  blockedSources: string[];
  children: ReactNode;
}

export const CatalogCard = ({ 
  activeTab, 
  setActiveTab, 
  showImportTab, 
  blockedSources,
  children 
}: CatalogCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Каталог автомобилей TMC Авто</CardTitle>
        <CardDescription>
          {showImportTab 
            ? 'Импорт и просмотр данных с catalog.tmcavto.ru' 
            : 'Просмотр данных каталога автомобилей'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertsPanel blockedSources={blockedSources} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-${showImportTab ? '2' : '1'}`}>
            <TabsTrigger value="catalog">Каталог</TabsTrigger>
            {showImportTab && <TabsTrigger value="import">Импорт данных</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="catalog">
            {children}
          </TabsContent>
          
          {showImportTab && (
            <TabsContent value="import">
              {children}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};
