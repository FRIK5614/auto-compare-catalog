
import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { useCars } from '@/hooks/useCars';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CarForm } from '@/components/CarForm';
import { Car } from '@/types/car';

const AdminCars: React.FC = () => {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const { cars, deleteCar } = useCars();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const handleAddCar = () => {
    setSelectedCar(null);
    setIsAddDialogOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCar = (carId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
      deleteCar(carId);
      toast({
        title: "Автомобиль удален",
        description: "Автомобиль был успешно удален из каталога"
      });
    }
  };

  const handleViewCar = (carId: string) => {
    navigate(`/car/${carId}`);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление автомобилями</h1>
        <Button onClick={handleAddCar}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить автомобиль
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Каталог автомобилей</CardTitle>
          <CardDescription>
            Управление каталогом автомобилей. Всего: {cars?.length || 0} автомобилей
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cars && cars.length > 0 ? (
            <Table>
              <TableCaption>Список всех автомобилей в каталоге</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Бренд</TableHead>
                  <TableHead>Модель</TableHead>
                  <TableHead>Год</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Страна</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>{car.brand}</TableCell>
                    <TableCell>{car.model}</TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                        maximumFractionDigits: 0
                      }).format(car.price.base)}
                    </TableCell>
                    <TableCell>{car.country || 'Не указана'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleViewCar(car.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEditCar(car)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteCar(car.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">В каталоге пока нет автомобилей</p>
              <Button onClick={handleAddCar}>
                <Plus className="mr-2 h-4 w-4" />
                Добавить автомобиль
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for adding a new car */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Добавление нового автомобиля</DialogTitle>
            <DialogDescription>
              Заполните информацию о новом автомобиле для добавления в каталог
            </DialogDescription>
          </DialogHeader>
          <CarForm onClose={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Dialog for editing an existing car */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактирование автомобиля</DialogTitle>
            <DialogDescription>
              Измените информацию об автомобиле
            </DialogDescription>
          </DialogHeader>
          {selectedCar && (
            <CarForm car={selectedCar} onClose={() => setIsEditDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCars;
