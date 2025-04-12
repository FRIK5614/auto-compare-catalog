
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Car } from '@/hooks/tmcAvtoCatalog';

interface CarCardProps {
  car: Car;
  isSelected: boolean;
  onToggleSelection: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, isSelected, onToggleSelection }) => {
  return (
    <Card 
      className={`cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`} 
      onClick={() => onToggleSelection(car)}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{car.brand} {car.model}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            asChild
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <a href={car.detailUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <CardDescription>
          {car.year} г., {car.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {car.imageUrl ? (
          <div className="aspect-[16/9] overflow-hidden rounded-md">
            <img 
              src={car.imageUrl} 
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-muted flex items-center justify-center rounded-md">
            Нет изображения
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="text-lg font-semibold">
          {car.price.toLocaleString()} ₽
        </div>
      </CardFooter>
    </Card>
  );
};
