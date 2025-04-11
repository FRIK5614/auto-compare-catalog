
import { useState } from "react";
import { Car } from "@/types/car";
import { useToast } from "@/hooks/use-toast";

interface ImportResults {
  total: number;
  successful: number;
  failed: number;
  errors: string[];
}

export const useImportExport = (
  cars: Car[],
  exportCarsData: () => string,
  importCarsData: (data: string) => Promise<boolean>
) => {
  const [importData, setImportData] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportResults | null>(null);
  const { toast } = useToast();

  // Handle export
  const handleExport = () => {
    setIsExporting(true);
    try {
      // Get the exported data as string
      const dataStr = exportCarsData();
      
      // Create and download the blob
      const blob = new Blob([dataStr], { type: "application/json" });
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
    const results: ImportResults = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: [],
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

  return {
    importData,
    setImportData,
    isImporting,
    isExporting,
    importResults,
    setImportResults,
    handleImport,
    handleExport
  };
};
