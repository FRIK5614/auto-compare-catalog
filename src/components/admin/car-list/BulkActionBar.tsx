
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash, X } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({ 
  selectedCount, 
  onClearSelection, 
  onBulkDelete 
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-muted/50 border rounded-md p-3 flex items-center justify-between">
      <div className="text-sm">
        Выбрано автомобилей: <span className="font-medium">{selectedCount}</span>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onClearSelection} className="h-8">
          <X className="mr-1 h-4 w-4" />
          Очистить
        </Button>
        <Button variant="destructive" size="sm" onClick={onBulkDelete} className="h-8">
          <Trash className="mr-1 h-4 w-4" />
          Удалить выбранные
        </Button>
      </div>
    </div>
  );
};
