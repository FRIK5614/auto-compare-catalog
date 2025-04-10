import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCars } from "@/hooks/useCars";
import { Car } from "@/types/car";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus, FileUp, FileDown } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const AdminCars = () => {
  const { cars, deleteCar, exportCarsData, importCarsData } = useCars();
  const [searchTerm, setSearchTerm] = useState("");
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredCars = cars.filter(
    (car) =>
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const data = exportCarsData();
    const blob = new Blob([data], { type: "application/json" });
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
      description: `Экспортировано ${cars.length} автомобилей`,
    });
  };

  const handleImport = () => {
    try {
      const success = importCarsData(importData);
      if (success) {
        setImportDialogOpen(false);
        setImportData("");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка импорта",
        description: "Неверный формат данных",
      });
    }
  };

  const openDeleteDialog = (car: Car) => {
    setCarToDelete(car);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (carToDelete) {
      deleteCar(carToDelete.id);
      setCarToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление автомобилями</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setImportDialogOpen(true)}
              className="flex items-center"
            >
              <FileUp className="mr-2 h-4 w-4" />
              Импорт
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Экспорт
            </Button>
            <Button
              onClick={() => navigate("/admin/cars/new")}
              className="flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Добавить автомобиль
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Поиск по марке или модели..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Марка</TableHead>
                <TableHead>Модель</TableHead>
                <TableHead>Год</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Просмотры</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCars.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Автомобили не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell className="font-medium">{car.brand}</TableCell>
                    <TableCell>{car.model}</TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: "RUB",
                        maximumFractionDigits: 0,
                      }).format(car.price.base)}
                    </TableCell>
                    <TableCell>
                      {car.isNew ? (
                        <Badge className="bg-green-500">Новый</Badge>
                      ) : (
                        <Badge variant="outline">Б/У</Badge>
                      )}
                    </TableCell>
                    <TableCell>{car.viewCount || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/cars/edit/${car.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => openDeleteDialog(car)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удаление автомобиля</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите удалить этот автомобиль? Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Удалить</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
                onChange={(e) => setImportData(e.target.value)}
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
