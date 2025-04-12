
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Download, ExternalLink, Loader2 } from 'lucide-react';
import { useTmcAvtoCatalog, Car } from '@/hooks/tmcAvtoCatalog';
import { CarCardsList } from '../car-list/CarCardsList';
import { ImportSourceButtons } from '../ImportSourceButtons';

const DEFAULT_URLS = {
  china: 'https://catalog.tmcavto.ru/china',
  japan: 'https://catalog.tmcavto.ru/japan',
  korea: 'https://catalog.tmcavto.ru/korea',
  all: 'https://catalog.tmcavto.ru'
};

export const ImportUrlTab = () => {
  const [catalogUrl, setCatalogUrl] = useState(DEFAULT_URLS.china);
  const [importLimit, setImportLimit] = useState('10');
  const [selectedCars, setSelectedCars] = useState<Record<string, boolean>>({});
  const [isImporting, setIsImporting] = useState(false);
  
  const { 
    fetchCatalogData, 
    loading, 
    cars: catalogCars, 
    blockedSources,
    error: catalogError 
  } = useTmcAvtoCatalog();
  
  const handleSourceChange = (source: string) => {
    switch(source) {
      case 'china':
        setCatalogUrl(DEFAULT_URLS.china);
        break;
      case 'japan':
        setCatalogUrl(DEFAULT_URLS.japan);
        break;
      case 'korea':
        setCatalogUrl(DEFAULT_URLS.korea);
        break;
      case 'all':
        setCatalogUrl(DEFAULT_URLS.all);
        break;
    }
  };
  
  const handleFetch = async () => {
    const urlWithLimit = catalogUrl.includes('?') 
      ? `${catalogUrl}&limit=${importLimit}` 
      : `${catalogUrl}?limit=${importLimit}`;
    
    try {
      await fetchCatalogData({ url: urlWithLimit });
    } catch (error) {
      console.error('Error fetching catalog data:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Импорт автомобилей из каталога</CardTitle>
        <CardDescription>
          Укажите URL категории каталога или воспользуйтесь предустановленными источниками
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <ImportSourceButtons 
            catalogUrl={catalogUrl} 
            blockedSources={blockedSources} 
            onSourceChange={handleSourceChange}
            defaultUrls={DEFAULT_URLS}
          />
          
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">URL категории</label>
              <Input 
                value={catalogUrl} 
                onChange={(e) => setCatalogUrl(e.target.value)}
                placeholder="https://catalog.tmcavto.ru/china/..." 
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium mb-1">Лимит</label>
              <Select value={importLimit} onValueChange={setImportLimit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleFetch}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Получить
            </Button>
          </div>
        </div>
        
        {catalogError && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4">
            <h3 className="font-semibold flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              Ошибка
            </h3>
            <p>{catalogError}</p>
          </div>
        )}
        
        {catalogCars.length > 0 && (
          <CarCardsList 
            cars={catalogCars} 
            selectedCars={selectedCars} 
            setSelectedCars={setSelectedCars}
            isImporting={isImporting}
            setIsImporting={setIsImporting}
          />
        )}
      </CardContent>
    </Card>
  );
};
