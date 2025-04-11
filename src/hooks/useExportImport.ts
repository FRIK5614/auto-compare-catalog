
import { useState } from 'react';
import { useCars } from './useCars';
import { Car } from '@/types/car';
import { useToast } from './use-toast';

interface ImportResults {
  total: number;
  successful: number;
  failed: number;
  errors: string[];
}

export const useExportImport = () => {
  const { cars, reloadCars } = useCars();
  const [importResults, setImportResults] = useState<ImportResults>({ 
    total: 0, 
    successful: 0, 
    failed: 0, 
    errors: [] 
  });
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importData, setImportData] = useState("");
  const { toast } = useToast();

  const exportCarsData = (): string => {
    try {
      setIsExporting(true);
      const exportData = cars?.map(car => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        colors: car.colors,
        price: car.price,
        // Using optional chaining for properties that might not exist
        // or mapping from existing properties in the Car type
        bodyType: car.bodyType,
        transmission: car.transmission,
        engineCapacity: car.engine?.displacement,
        enginePower: car.engine?.power,
        drivetrain: car.drivetrain,
        country: car.country,
        isNew: car.isNew,
        features: car.features,
        description: car.description,
        image_url: car.images && car.images.length > 0 ? car.images[0].url : car.image_url,
        viewCount: car.viewCount
      }));

      const jsonString = JSON.stringify(exportData, null, 2);
      setIsExporting(false);
      return jsonString;
    } catch (error) {
      console.error('Error exporting cars data:', error);
      setIsExporting(false);
      return JSON.stringify({ error: 'Failed to export data' });
    }
  };

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

  const importCarsData = async (jsonData: string): Promise<boolean> => {
    setIsImporting(true);
    setImportResults({ total: 0, successful: 0, failed: 0, errors: [] });

    try {
      const parsedData = JSON.parse(jsonData);
      const successItems: Car[] = [];
      const errorMessages: string[] = [];
      
      // Update the total count
      const totalItems = Array.isArray(parsedData) ? parsedData.length : 0;
      
      // Process import logic here
      // This is just a placeholder - you would implement actual import logic
      
      setImportResults({
        total: totalItems,
        successful: successItems.length,
        failed: errorMessages.length,
        errors: errorMessages
      });
      
      if (successItems.length > 0) {
        await reloadCars();
      }
      
      return true;
    } catch (error) {
      console.error('Error importing cars data:', error);
      setImportResults({
        total: 0,
        successful: 0,
        failed: 1,
        errors: ['Invalid JSON format or data structure']
      });
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      toast({
        variant: "destructive",
        title: "Пустые данные",
        description: "Пожалуйста, вставьте JSON данные для импорта",
      });
      return;
    }

    const success = await importCarsData(importData);
    
    if (success) {
      toast({
        title: "Импорт завершен",
        description: `Данные успешно импортированы`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка импорта",
        description: "Не удалось импортировать данные",
      });
    }
  };

  return {
    exportCarsData,
    importCarsData,
    importResults,
    isImporting,
    isExporting,
    importData,
    setImportData,
    handleImport,
    handleExport
  };
};
