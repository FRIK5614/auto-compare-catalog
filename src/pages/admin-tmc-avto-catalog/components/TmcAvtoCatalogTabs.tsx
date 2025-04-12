
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImportUrlTab } from './tabs/ImportUrlTab';
import { FullImportTab } from './tabs/FullImportTab';
import { LogsTab } from './tabs/LogsTab';
import { useTmcAvtoCatalog } from '@/hooks/tmcAvtoCatalog';

export const TmcAvtoCatalogTabs = () => {
  const [selectedTab, setSelectedTab] = useState('import');
  const { logs, importAllCars, loading, cars: catalogCars, blockedSources } = useTmcAvtoCatalog();

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="import">Импорт по URL</TabsTrigger>
        <TabsTrigger value="full-import">Полный импорт</TabsTrigger>
        <TabsTrigger value="logs">Логи ({logs.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="import">
        <ImportUrlTab />
      </TabsContent>
      
      <TabsContent value="full-import">
        <FullImportTab 
          importAllCars={importAllCars} 
          loading={loading} 
          blockedSources={blockedSources} 
        />
      </TabsContent>
      
      <TabsContent value="logs">
        <LogsTab logs={logs} />
      </TabsContent>
    </Tabs>
  );
};
