
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCars } from '@/hooks/useCars';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarNavigationProps {
  currentCarId: string;
  className?: string;
}

const CarNavigation: React.FC<CarNavigationProps> = ({ currentCarId, className }) => {
  const { cars } = useCars();
  const navigate = useNavigate();
  
  // Находим индекс текущего автомобиля
  const currentIndex = cars.findIndex(car => car.id === currentCarId);
  
  // Если автомобиль не найден или список пуст, не отображаем навигацию
  if (currentIndex === -1 || cars.length <= 1) {
    return null;
  }
  
  // Определяем предыдущий и следующий автомобили
  const prevCar = currentIndex > 0 ? cars[currentIndex - 1] : null;
  const nextCar = currentIndex < cars.length - 1 ? cars[currentIndex + 1] : null;
  
  return (
    <div className={`flex justify-between items-center ${className || ''}`}>
      {prevCar ? (
        <Button 
          variant="outline" 
          onClick={() => navigate(`/car/${prevCar.id}`)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Предыдущий
        </Button>
      ) : (
        <div /> // Пустой div для сохранения расположения
      )}
      
      {nextCar ? (
        <Button 
          variant="outline" 
          onClick={() => navigate(`/car/${nextCar.id}`)}
          className="flex items-center gap-2"
        >
          Следующий
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <div /> // Пустой div для сохранения расположения
      )}
    </div>
  );
};

export default CarNavigation;
