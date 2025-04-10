
import React from "react";
import { Car } from "@/types/car";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import CarTableRow from "./CarTableRow";

interface CarTableProps {
  cars: Car[];
  selectedCars: string[];
  loading: boolean;
  searchQuery: string;
  onSelectAll: (checked: boolean) => void;
  onSelectCar: (carId: string, checked: boolean) => void;
  onView: (carId: string) => void;
  onEdit: (carId: string) => void;
  onDelete: (car: Car) => void;
}

const CarTable = ({
  cars,
  selectedCars,
  loading,
  searchQuery,
  onSelectAll,
  onSelectCar,
  onView,
  onEdit,
  onDelete,
}: CarTableProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCars.length > 0 && selectedCars.length === cars.length}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead>Марка</TableHead>
              <TableHead>Модель</TableHead>
              <TableHead>Год</TableHead>
              <TableHead className="text-right">Цена</TableHead>
              <TableHead className="w-32 text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                  <div className="mt-2 text-gray-500">Загрузка...</div>
                </TableCell>
              </TableRow>
            ) : cars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-gray-500">
                    {searchQuery ? "По запросу ничего не найдено" : "Автомобили не найдены"}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              cars.map((car) => (
                <CarTableRow
                  key={car.id}
                  car={car}
                  isSelected={selectedCars.includes(car.id)}
                  onSelect={onSelectCar}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CarTable;
