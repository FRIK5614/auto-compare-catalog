
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useTmcAvtoCatalog, Car } from '@/hooks/useTmcAvtoCatalog';
import { useCars } from '@/hooks/useCars';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Download, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_URLS = {
  china: 'https://catalog.tmcavto.ru/china',
  japan: 'https://catalog.tmcavto.ru/japan',
  korea: 'https://catalog.tmcavto.ru/korea',
  all: 'https://catalog.tmcavto.ru'
};

const AdminTmcAvtoCatalog = () => {
  const [selectedTab, setSelectedTab] = useState('import');
  const [catalogUrl, setCatalogUrl] = useState(DEFAULT_URLS.china);
  const [importLimit, setImportLimit] = useState('10');
  const [selectedCars, setSelectedCars] = useState<Record<string, boolean>>({});
  const [isImporting, setIsImporting] = useState(false);
  
  const { 
    fetchCatalogData, 
    importAllCars, 
    loading, 
    cars: catalogCars, 
    logs, 
    blockedSources,
    error: catalogError
  } = useTmcAvtoCatalog();
  
  const { addCar } = useCars();
  const { toast } = useToast();
  
  // Handle predefined source selection
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
  
  // Handle URL fetch with limit
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
  
  // Toggle car selection
  const toggleCarSelection = (car: Car) => {
    setSelectedCars(prev => ({
      ...prev,
      [car.id]: !prev[car.id]
    }));
  };
  
  // Get selected cars count
  const getSelectedCount = () => {
    return Object.values(selectedCars).filter(selected => selected).length;
  };
  
  // Select all cars
  const selectAllCars = () => {
    const newSelected: Record<string, boolean> = {};
    catalogCars.forEach(car => {
      newSelected[car.id] = true;
    });
    setSelectedCars(newSelected);
  };
  
  // Deselect all cars
  const deselectAllCars = () => {
    setSelectedCars({});
  };
  
  // Import selected cars
  const importSelectedCars = async () => {
    const selectedCarIds = Object.entries(selectedCars)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);
    
    if (selectedCarIds.length === 0) {
      toast({
        title: 'Ничего не выбрано',
        description: 'Пожалуйста, выберите автомобили для импорта',
        variant: 'destructive',
      });
      return;
    }
    
    setIsImporting(true);
    try {
      // Filter catalog cars to get only selected ones
      const carsToImport = catalogCars.filter(car => selectedCarIds.includes(car.id));
      
      // Convert them to the format expected by the Cars context
      for (const car of carsToImport) {
        const formattedCar = {
          id: uuidv4(), // Generate a new unique ID
          brand: car.brand,
          model: car.model,
          year: car.year,
          price: {
            base: car.price
          },
          country: car.country || '',
          image_url: car.imageUrl,
          images: [
            {
              id: uuidv4(),
              url: car.imageUrl,
              alt: `${car.brand} ${car.model}`
            }
          ],
          isNew: true,
          viewCount: 0,
          description: `Импортировано из каталога TMC Авто: ${car.detailUrl}`
        };
        
        await addCar(formattedCar);
      }
      
      toast({
        title: 'Импорт завершен',
        description: `Успешно импортировано ${carsToImport.length} автомобилей`,
      });
      
      // Reset selections after import
      setSelectedCars({});
    } catch (error) {
      console.error('Error importing cars:', error);
      toast({
        title: 'Ошибка импорта',
        description: 'Не удалось импортировать выбранные автомобили',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  // Import all cars from all sources
  const handleFullImport = async () => {
    setIsImporting(true);
    try {
      await importAllCars({
        onSuccess: (data) => {
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
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Каталог TMC Авто</h1>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="import">Импорт по URL</TabsTrigger>
            <TabsTrigger value="full-import">Полный импорт</TabsTrigger>
            <TabsTrigger value="logs">Логи ({logs.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Импорт автомобилей из каталога</CardTitle>
                <CardDescription>
                  Укажите URL категории каталога или воспользуйтесь предустановленными источниками
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <Button 
                      variant={catalogUrl === DEFAULT_URLS.china ? "default" : "outline"} 
                      onClick={() => handleSourceChange('china')}
                      disabled={blockedSources.includes('china')}
                    >
                      {blockedSources.includes('china') && <AlertCircle className="mr-2 h-4 w-4" />}
                      Китай
                    </Button>
                    <Button 
                      variant={catalogUrl === DEFAULT_URLS.japan ? "default" : "outline"} 
                      onClick={() => handleSourceChange('japan')}
                      disabled={blockedSources.includes('japan')}
                    >
                      {blockedSources.includes('japan') && <AlertCircle className="mr-2 h-4 w-4" />}
                      Япония
                    </Button>
                    <Button 
                      variant={catalogUrl === DEFAULT_URLS.korea ? "default" : "outline"} 
                      onClick={() => handleSourceChange('korea')}
                      disabled={blockedSources.includes('korea')}
                    >
                      {blockedSources.includes('korea') && <AlertCircle className="mr-2 h-4 w-4" />}
                      Корея
                    </Button>
                    <Button 
                      variant={catalogUrl === DEFAULT_URLS.all ? "default" : "outline"} 
                      onClick={() => handleSourceChange('all')}
                    >
                      Все
                    </Button>
                  </div>
                  
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
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Найдено: {catalogCars.length} автомобилей
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={selectAllCars}
                        >
                          Выбрать все
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={deselectAllCars}
                        >
                          Снять выбор
                        </Button>
                        <Button 
                          size="sm"
                          onClick={importSelectedCars}
                          disabled={getSelectedCount() === 0 || isImporting}
                        >
                          {isImporting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="mr-2 h-4 w-4" />
                          )}
                          Импортировать ({getSelectedCount()})
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {catalogCars.map((car) => (
                        <Card key={car.id} className={`cursor-pointer ${selectedCars[car.id] ? 'ring-2 ring-primary' : ''}`} onClick={() => toggleCarSelection(car)}>
                          <CardHeader className="p-4 pb-0">
                            <div className="flex justify-between">
                              <CardTitle className="text-lg">{car.brand} {car.model}</CardTitle>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                asChild
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <a href={car.detailUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                            <CardDescription>
                              {car.year} г., {car.country}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4">
                            {car.imageUrl ? (
                              <div className="aspect-[16/9] overflow-hidden rounded-md">
                                <img 
                                  src={car.imageUrl} 
                                  alt={`${car.brand} ${car.model}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="aspect-[16/9] bg-muted flex items-center justify-center rounded-md">
                                Нет изображения
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <div className="text-lg font-semibold">
                              {car.price.toLocaleString()} ₽
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="full-import">
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
                  disabled={isImporting}
                  className="w-full"
                >
                  {isImporting ? (
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
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Логи импорта</CardTitle>
                <CardDescription>
                  Информация о процессе импорта и возникших ошибках
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Логи пока отсутствуют</p>
                  </div>
                ) : (
                  <div className="bg-muted/50 p-4 rounded-md overflow-auto max-h-[500px]">
                    <pre className="text-xs">
                      {logs.map((log, index) => (
                        <div key={index} className="mb-1">
                          {log.includes('Ошибка') || log.includes('ошибка') ? (
                            <span className="text-destructive">{log}</span>
                          ) : log.includes('Успешно') || log.includes('успешно') ? (
                            <span className="text-green-600 dark:text-green-400">{log}</span>
                          ) : (
                            <span>{log}</span>
                          )}
                        </div>
                      ))}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminTmcAvtoCatalog;
