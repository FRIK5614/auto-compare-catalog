
import React from "react";
import { Car } from "@/types/car";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash, Eye } from "lucide-react";

interface CarTableRowProps {
  car: Car;
  isSelected: boolean;
  onSelect: (carId: string, checked: boolean) => void;
  onView: (carId: string) => void;
  onEdit: (carId: string) => void;
  onDelete: (car: Car) => void;
}

const CarTableRow = ({
  car,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
}: CarTableRowProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(car.id, !!checked)}
        />
      </TableCell>
      <TableCell>{car.brand}</TableCell>
      <TableCell>{car.model}</TableCell>
      <TableCell>{car.year}</TableCell>
      <TableCell className="text-right">{formatPrice(car.price.base)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onView(car.id)} title="Просмотр">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(car.id)} title="Редактировать">
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(car)}
            title="Удалить"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CarTableRow;
