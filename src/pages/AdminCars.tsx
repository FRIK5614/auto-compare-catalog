
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCars } from "@/hooks/useCars";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { FileUp, FileDown, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminCarsList from "@/components/AdminCarsList";
import { useExportImport } from "@/hooks/useExportImport";

const AdminCars = () => {
  const { cars, deleteCar } = useCars();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
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
  
  const handleOpenImportDialog = () => {
    setImportDialogOpen(true);
  };
  
  const handleDeleteCar = async (id: string) => {
    try {
      await deleteCar(id);
      toast({
        title: "Автомобиль удален",
        description: "Автомобиль был успешно удален из базы данных"
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить автомобиль",
        variant: "destructive"
      });
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
