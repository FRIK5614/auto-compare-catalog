
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Database, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";
import AdminCarsList from "@/components/AdminCarsList";

const AdminCars = () => {
  const admin = useAdmin();
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleEditCar = (carId: string) => {
    navigate(`/admin/cars/edit/${carId}`);
  };
  
  const handleDeleteCar = (carId: string) => {
    setCarToDelete(carId);
  };
  
  const confirmDelete = async () => {
    if (!carToDelete) return;
    
    try {
      await admin.deleteCar(carToDelete);
      toast.success("Автомобиль успешно удален");
    } catch (error) {
      toast.error("Ошибка при удалении автомобиля");
      console.error(error);
    } finally {
      setCarToDelete(null);
    }
  };
  
  const handleViewCar = (carId: string) => {
    navigate(`/car/${carId}`);
  };
  
  const handleSynchronize = () => {
    toast.info("Синхронизация данных запущена");
    // Implement data synchronization logic
  };
  
  const handleAddCar = () => {
    navigate("/admin/cars/create");
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Управление автомобилями</h1>
          <p className="text-gray-500">Просмотр и редактирование автомобилей в каталоге</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleSynchronize} className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            Синхронизировать
          </Button>
          
          <Button onClick={handleAddCar} className="flex items-center ml-auto">
            <Plus className="mr-2 h-4 w-4" />
            Добавить автомобиль
          </Button>
        </div>
        
        <AdminCarsList
          cars={admin.cars || []}
          onEdit={handleEditCar}
          onDelete={handleDeleteCar}
          onView={handleViewCar}
          loading={admin.loading || false}
        />
        
        <AlertDialog open={!!carToDelete} onOpenChange={() => setCarToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Автомобиль будет безвозвратно удален из системы.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCars;
