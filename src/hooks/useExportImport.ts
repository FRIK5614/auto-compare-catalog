
import { useState } from 'react';
import { useCars } from './useCars';
import { Car } from '@/types/car';
import { useToast } from './use-toast';

export const useExportImport = () => {
  const { cars, reloadCars } = useCars();
  const [importResults, setImportResults] = useState<{ success: Car[], errors: string[] }>({ success: [], errors: [] });
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
        vin: car.vin || "",
        status: car.status || "available",
        bodyType: car.bodyType,
        transmission: car.transmission,
        engineSize: car.engineSize,
        power: car.power,
        drive: car.drive,
        country: car.country,
        condition: car.condition || "new",
        features: car.features,
        description: car.description,
        image_url: car.image_url,
        featured: car.featured,
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
    setImportResults({ success: [], errors: [] });

    try {
      const parsedData = JSON.parse(jsonData);
      const successItems: Car[] = [];
      const errorMessages: string[] = [];

      // Process import logic here
      // This is just a placeholder - you would implement actual import logic

      setImportResults({
        success: successItems,
        errors: errorMessages
      });
      
      if (successItems.length > 0) {
        await reloadCars();
      }
      
      return true;
    } catch (error) {
      console.error('Error importing cars data:', error);
      setImportResults({
        success: [],
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
