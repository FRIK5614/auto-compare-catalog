
import { useState } from "react";
import { Car } from "@/types/car";
import { useToast } from "@/hooks/use-toast";

export const useExportImport = (
  cars: Car[],
  exportCarsData: () => string,
  importCarsData: (data: string) => Promise<boolean>
) => {
  const [importData, setImportData] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Handle export
  const handleExport = () => {
    setIsExporting(true);
    try {
      const dataStr = exportCarsData();
      
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
        description: `Экспортировано ${cars.length} автомобилей`
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка экспорта",
        description: "Неверный формат данных"
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle import
  const handleImport = async () => {
    setIsImporting(true);
    try {
      if (!importData.trim()) {
        toast({
          variant: "destructive",
          title: "Пустые данные",
          description: "Вставьте JSON данные для импорта"
        });
        setIsImporting(false);
        return;
      }
      
      const success = await importCarsData(importData);
      if (success) {
        setImportData("");
        toast({
          title: "Импорт выполнен",
          description: "Данные успешно импортированы"
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка импорта",
        description: "Неверный формат данных"
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
    handleImport,
    handleExport
  };
};
