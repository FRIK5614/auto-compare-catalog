
import React, { useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useCars } from "@/hooks/useCars";
import { Car } from "@/types/car";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileUp, FileDown, Upload, Clipboard, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const AdminImport = () => {
  const { cars, exportCarsData, importCarsData } = useCars();
  const [importData, setImportData] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle export
  const handleExport = () => {
    setIsExporting(true);
    try {
      // Get the exported data as string
      const data = exportCarsData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cars-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Экспорт выполнен",
        description: `Экспортировано ${cars.length} автомобилей`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать данные",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle import
  const handleImport = async () => {
    if (!importData.trim()) {
      toast({
        variant: "destructive",
        title: "Пустые данные",
        description: "Пожалуйста, вставьте JSON данные для импорта",
      });
      return;
    }

    setIsImporting(true);
    const results = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    try {
      // Parse and validate JSON
      let carsToImport: Car[] = [];
      try {
        carsToImport = JSON.parse(importData);
        if (!Array.isArray(carsToImport)) {
          throw new Error("Данные должны быть массивом");
        }
        results.total = carsToImport.length;
      } catch (parseError: any) {
        throw new Error(`Ошибка разбора JSON: ${parseError.message}`);
      }

      // Process each car
      for (let i = 0; i < carsToImport.length; i++) {
        const car = carsToImport[i];
        
        try {
          // Validate required fields
          if (!car.brand || !car.model) {
            throw new Error("Отсутствуют обязательные поля: марка или модель");
          }
          
          // Check for duplicate ID
          const existingCar = cars.find(c => c.id === car.id);
          if (existingCar) {
            // Generate a new unique ID to avoid conflict
            const message = `Автомобиль с ID ${car.id} (${car.brand} ${car.model}) уже существует. Будет создан новый экземпляр с новым ID.`;
            results.errors.push(message);
            console.warn(message);
            
            // We continue with import but will generate a new ID
            // The importCarsData function will handle this
          }
          
          // Proceed with import
          results.successful++;
        } catch (validationError: any) {
          results.failed++;
          results.errors.push(`Ошибка валидации для ${car.brand || ""} ${car.model || ""}: ${validationError.message}`);
        }
      }

      // Import all cars at once
      const success = await importCarsData(importData);
      
      if (!success) {
        throw new Error("Не удалось импортировать данные");
      }

      setImportResults(results);
      
      toast({
        title: "Импорт завершен",
        description: `Импортировано ${results.successful} из ${results.total} автомобилей`,
      });
    } catch (error: any) {
      console.error("Import error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка импорта",
        description: error.message || "Не удалось импортировать данные",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  // Copy to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(importData);
    toast({
      title: "Скопировано",
      description: "Данные скопированы в буфер обмена",
    });
  };

  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Импорт/Экспорт данных</h1>

        <Tabs defaultValue="import">
          <TabsList className="mb-6">
            <TabsTrigger value="import">Импорт</TabsTrigger>
            <TabsTrigger value="export">Экспорт</TabsTrigger>
            {importResults && <TabsTrigger value="results">Результаты импорта</TabsTrigger>}
          </TabsList>

          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Импорт данных</CardTitle>
                <CardDescription>
                  Импортируйте данные автомобилей из JSON файла или вставьте их вручную
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleFileInputClick}
                      className="flex items-center"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Загрузить файл
                    </Button>
                    <Input
                      type="file"
                      accept=".json"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant="outline"
                      onClick={handleCopyToClipboard}
                      disabled={!importData}
                      className="flex items-center"
                    >
                      <Clipboard className="mr-2 h-4 w-4" />
                      Копировать
                    </Button>
                  </div>

                  <ScrollArea className="h-[400px] border rounded-md p-4">
                    <textarea
                      className="w-full h-full p-2 font-mono text-sm resize-none focus:outline-none"
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder='[{"id": "1", "brand": "BMW", "model": "X5", ...}]'
                    />
                  </ScrollArea>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  {importData && (
                    <span className="text-sm text-muted-foreground">
                      {importData.length.toLocaleString()} символов
                    </span>
                  )}
                </div>
                <Button 
                  onClick={handleImport}
                  disabled={isImporting || !importData}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Импорт...
                    </>
                  ) : (
                    <>
                      <FileUp className="mr-2 h-4 w-4" />
                      Импортировать
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Экспорт данных</CardTitle>
                <CardDescription>
                  Экспортируйте все данные автомобилей в формате JSON
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Информация</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    При экспорте будут сохранены все данные о {cars.length} автомобилях в вашей базе данных.
                    Файл можно использовать для резервного копирования или передачи данных.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Экспортированный файл можно будет импортировать обратно через вкладку "Импорт".
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleExport}
                  disabled={isExporting || cars.length === 0}
                  className="ml-auto"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Экспорт...
                    </>
                  ) : (
                    <>
                      <FileDown className="mr-2 h-4 w-4" />
                      Экспортировать {cars.length} автомобилей
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {importResults && (
            <TabsContent value="results">
              <Card>
                <CardHeader>
                  <CardTitle>Результаты импорта</CardTitle>
                  <CardDescription>
                    Информация о результатах последнего импорта
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{importResults.total}</Badge>
                        <span>Всего автомобилей</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400">
                          <Check className="mr-1 h-3 w-3" />
                          {importResults.successful}
                        </Badge>
                        <span>Успешно импортировано</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">{importResults.failed}</Badge>
                        <span>Не удалось импортировать</span>
                      </div>
                    </div>
                  </div>

                  {importResults.errors.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Ошибки:</h3>
                      <ScrollArea className="h-[200px] border rounded-md p-2">
                        <ul className="space-y-1">
                          {importResults.errors.map((error, index) => (
                            <li key={index} className="text-sm text-destructive">
                              {error}
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="default" 
                    onClick={() => setImportResults(null)}
                    className="ml-auto"
                  >
                    Закрыть
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminImport;
