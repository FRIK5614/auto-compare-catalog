
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCars } from "@/hooks/useCars";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { FileUp, FileDown, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminCarsList from "@/components/AdminCarsList";
import { useExportImport } from "@/hooks/useExportImport";
import { supabase } from "@/integrations/supabase/client";

const AdminCars = () => {
  const { cars, deleteCar, reloadCars } = useCars();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    exportCarsData,
    importCarsData,
    importData,
    setImportData,
    isImporting,
    isExporting,
    handleImport,
    handleExport
  } = useExportImport();

  // Load cars when component mounts
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await reloadCars();
      } catch (error) {
        console.error("Failed to load cars:", error);
        toast({
          variant: "destructive",
          title: "Ошибка загрузки",
          description: "Не удалось загрузить список автомобилей"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [reloadCars, toast]);
  
  const handleOpenImportDialog = () => {
    setImportDialogOpen(true);
  };
  
  const handleDeleteCar = async (id: string) => {
    try {
      setIsLoading(true);
      
      // First delete directly from the database using Supabase
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Failed to delete car from database: ${error.message}`);
      }
      
      // Then update the local state
      await deleteCar(id);
      
      // Reload the cars to ensure our list is up to date
      await reloadCars();
      
      toast({
        title: "Автомобиль удален",
        description: "Автомобиль был успешно удален из базы данных"
      });
    } catch (error) {
      console.error("Error deleting car:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить автомобиль",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-6 p-4">
        <h1 className="text-2xl font-bold">Управление автомобилями</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenImportDialog} className="flex items-center">
            <FileUp className="mr-2 h-4 w-4" />
            Импорт
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isExporting} className="flex items-center">
            <FileDown className="mr-2 h-4 w-4" />
            {isExporting ? "Экспорт..." : "Экспорт"}
          </Button>
          <Button onClick={() => navigate("/admin/cars/new")} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Добавить автомобиль
          </Button>
        </div>
      </div>

      <AdminCarsList 
        cars={cars} 
        loading={isLoading}
        onEdit={id => navigate(`/admin/cars/edit/${id}`)} 
        onDelete={handleDeleteCar}
        onView={id => navigate(`/cars/${cars.find(car => car.id === id)?.brand.toLowerCase() || 'brand'}/${cars.find(car => car.id === id)?.model.toLowerCase() || 'model'}/${id}`)} 
      />

      <AlertDialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Импорт данных</AlertDialogTitle>
            <AlertDialogDescription>
              Вставьте JSON данные для импорта автомобилей. Существующие данные
              будут заменены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <textarea 
              className="w-full h-64 p-2 border rounded-md" 
              value={importData} 
              onChange={e => setImportData(e.target.value)} 
              placeholder='[{"id": "1", "brand": "BMW", ...}]' 
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleImport}
              disabled={isImporting}
            >
              {isImporting ? "Импорт..." : "Импортировать"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCars;
