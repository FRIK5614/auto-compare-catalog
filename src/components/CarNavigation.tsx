
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCars } from '@/hooks/useCars';
import { Car } from '@/types/car';

interface CarNavigationProps {
  currentCarId: string;
  className?: string;
}

const CarNavigation: React.FC<CarNavigationProps> = ({ currentCarId, className = '' }) => {
  const { cars, filter } = useCars();
  const navigate = useNavigate();
  
  // Get adjacent cars based on the current sorting 
  const getAdjacentCars = (): { prev: Car | null; next: Car | null } => {
    if (!cars.length) return { prev: null, next: null };
    
    // Find current car index
    const sortedCars = [...cars].sort((a, b) => {
      if (filter.sortBy === 'priceAsc') return a.price.base - b.price.base;
      if (filter.sortBy === 'priceDesc') return b.price.base - a.price.base;
      if (filter.sortBy === 'yearDesc') return b.year - a.year;
      if (filter.sortBy === 'yearAsc') return a.year - b.year;
      if (filter.sortBy === 'nameAsc') return (a.brand + a.model).localeCompare(b.brand + b.model);
      if (filter.sortBy === 'nameDesc') return (b.brand + b.model).localeCompare(a.brand + a.model);
      // Default: by popularity/viewCount
      return (b.viewCount || 0) - (a.viewCount || 0);
    });
    
    const currentIndex = sortedCars.findIndex(car => car.id === currentCarId);
    
    if (currentIndex === -1) return { prev: null, next: null };
    
    const prev = currentIndex > 0 ? sortedCars[currentIndex - 1] : null;
    const next = currentIndex < sortedCars.length - 1 ? sortedCars[currentIndex + 1] : null;
    
    return { prev, next };
  };
  
  const { prev, next } = getAdjacentCars();
  
  const navigateToCar = (carId: string) => {
    navigate(`/car/${carId}`);
  };
  
  return (
    <div className={`flex justify-between ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-white shadow-sm"
        onClick={() => prev && navigateToCar(prev.id)}
        disabled={!prev}
        title={prev ? `Предыдущий: ${prev.brand} ${prev.model}` : 'Нет предыдущего автомобиля'}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-white shadow-sm"
        onClick={() => next && navigateToCar(next.id)}
        disabled={!next}
        title={next ? `Следующий: ${next.brand} ${next.model}` : 'Нет следующего автомобиля'}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CarNavigation;
