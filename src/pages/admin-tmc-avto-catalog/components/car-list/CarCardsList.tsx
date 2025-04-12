
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Car } from '@/hooks/tmcAvtoCatalog';
import { Loader2, Download } from 'lucide-react';
import { useCars } from '@/hooks/useCars';
import { useToast } from '@/hooks/use-toast';
import { createCarFromImportData } from '@/components/admin/car-form/utils/carUrlFetcher';
import { CarCard } from './CarCard';

interface CarCardsListProps {
  cars: Car[];
  selectedCars: Record<string, boolean>;
  setSelectedCars: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isImporting: boolean;
  setIsImporting: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CarCardsList: React.FC<CarCardsListProps> = ({ 
  cars, 
  selectedCars, 
  setSelectedCars,
  isImporting,
  setIsImporting
}) => {
  const { addCar } = useCars();
  const { toast } = useToast();

  const toggleCarSelection = (car: Car) => {
    setSelectedCars(prev => ({
      ...prev,
      [car.id]: !prev[car.id]
    }));
  };
  
  const getSelectedCount = () => {
    return Object.values(selectedCars).filter(selected => selected).length;
  };
  
  const selectAllCars = () => {
    const newSelected: Record<string, boolean> = {};
    cars.forEach(car => {
      newSelected[car.id] = true;
    });
    setSelectedCars(newSelected);
  };
  
  const deselectAllCars = () => {
    setSelectedCars({});
  };
  
  const importSelectedCars = async () => {
    const selectedCarIds = Object.entries(selectedCars)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);
    
    if (selectedCarIds.length === 0) {
      toast({
        title: 'Ничего не выбрано',
        description: 'Пожалуйста, выберите автомобили для импорта',
        variant: 'destructive',
      });
      return;
    }
    
    setIsImporting(true);
    try {
      const carsToImport = cars.filter(car => selectedCarIds.includes(car.id));
      
      for (const car of carsToImport) {
        const formattedCar = createCarFromImportData({
          brand: car.brand,
          model: car.model,
          year: car.year,
          price: car.price,
          country: car.country,
          imageUrl: car.imageUrl,
          url: car.detailUrl,
        });
        
        await addCar(formattedCar);
      }
      
      toast({
        title: 'Импорт завершен',
        description: `Успешно импортировано ${carsToImport.length} автомобилей`,
      });
      
      setSelectedCars({});
    } catch (error) {
      console.error('Error importing cars:', error);
      toast({
        title: 'Ошибка импорта',
        description: 'Не удалось импортировать выбранные автомобили',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-sm text-muted-foreground">
            Найдено: {cars.length} автомобилей
          </span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={selectAllCars}
          >
            Выбрать все
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={deselectAllCars}
          >
            Снять выбор
          </Button>
          <Button 
            size="sm"
            onClick={importSelectedCars}
            disabled={getSelectedCount() === 0 || isImporting}
          >
            {isImporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Импортировать ({getSelectedCount()})
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((car) => (
          <CarCard 
            key={car.id} 
            car={car} 
            isSelected={!!selectedCars[car.id]} 
            onToggleSelection={toggleCarSelection} 
          />
        ))}
      </div>
    </div>
  );
};
