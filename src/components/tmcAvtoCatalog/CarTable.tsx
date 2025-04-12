
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Car } from '@/hooks/tmcAvtoCatalog';

interface CarTableProps {
  cars: Car[];
}

export const CarTable = ({ cars }: CarTableProps) => {
  if (cars.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">Нет данных для отображения</p>;
  }
  
  return (
    <Table>
      <TableCaption>Список импортированных автомобилей</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Страна</TableHead>
          <TableHead>Бренд</TableHead>
          <TableHead>Модель</TableHead>
          <TableHead>Год</TableHead>
          <TableHead>Цена</TableHead>
          <TableHead>Фото</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cars.map((car) => (
          <TableRow key={car.id}>
            <TableCell>{car.country}</TableCell>
            <TableCell>{car.brand}</TableCell>
            <TableCell>{car.model}</TableCell>
            <TableCell>{car.year}</TableCell>
            <TableCell>
              {car.price ? new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                maximumFractionDigits: 0
              }).format(car.price) : 'Не указана'}
            </TableCell>
            <TableCell>
              {car.imageUrl ? (
                <a href={car.detailUrl} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={car.imageUrl} 
                    alt={`${car.brand} ${car.model}`}
                    className="w-16 h-12 object-cover rounded" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </a>
              ) : (
                'Нет фото'
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
