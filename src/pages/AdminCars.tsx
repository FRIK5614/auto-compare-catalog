
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCars } from "@/hooks/useCars";
import { Car } from "@/types/car";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FileUp, FileDown, Plus } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import AdminCarsList from "@/components/AdminCarsList";
import { CarDeleteDialog } from "@/components/admin/car-form";

const AdminCars = () => {
  const {
    cars,
    deleteCar,
    exportCarsData,
    importCarsData
  } = useCars();
  const [searchTerm, setSearchTerm] = useState("");
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const filteredCars = cars.filter(car => 
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleExport = () => {
    setIsExporting(true);
    try {
      // Get data as a string first and check that it's valid
      const dataStr = exportCarsData();
      if (!dataStr) {
        throw new Error("Не удалось получить данные для экспорта");
      }
      
      // Create blob from the string
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cars-export.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Экспорт выполнен",
        description: `Экспортировано ${cars.length} автомобилей`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка экспорта",
        description: "Неверный формат данных"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleImport = async () => {
    try {
      const success = await importCarsData(importData);
      if (success) {
        setImportDialogOpen(false);
        setImportData("");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка импорта",
        description: "Неверный формат данных"
      });
    }
  };
  
  const openDeleteDialog = (car: Car) => {
    setCarToDelete(car);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (carToDelete) {
      await deleteCar(carToDelete.id);
      setCarToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleDelete = (id: string) => {
    const car = cars.find(c => c.id === id);
    if (car) {
      openDeleteDialog(car);
    }
  };

  return (
    <AdminLayout>
      <div className="p-0">
        <div className="flex justify-between items-center mb-6 p-4">
          <h1 className="text-2xl font-bold">Управление автомобилями</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setImportDialogOpen(true)} className="flex items-center">
              <FileUp className="mr-2 h-4 w-4" />
              Импорт
            </Button>
            <Button variant="outline" onClick={handleExport} className="flex items-center">
              <FileDown className="mr-2 h-4 w-4" />
              Экспорт
            </Button>
            <Button onClick={() => navigate("/admin/cars/new")} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Добавить автомобиль
            </Button>
          </div>
        </div>

        <div className="px-4 mb-4">
          <Input 
            placeholder="Поиск по марке или модели..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            className="max-w-md" 
          />
        </div>

        <div className="px-0">
          <AdminCarsList 
            cars={filteredCars} 
            onEdit={id => navigate(`/admin/cars/edit/${id}`)} 
            onDelete={handleDelete} 
            onView={id => navigate(`/car/${id}`)} 
          />
        </div>

        <CarDeleteDialog 
          open={isDeleteDialogOpen} 
          onOpenChange={setIsDeleteDialogOpen} 
          onConfirm={confirmDelete} 
          carName={carToDelete ? `${carToDelete.brand} ${carToDelete.model}` : undefined} 
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
              <AlertDialogAction onClick={handleImport}>
                Импортировать
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCars;
