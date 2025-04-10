
import React from "react";
import { Button } from "@/components/ui/button";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
}

const BulkActionBar = ({
  selectedCount,
  onClearSelection,
  onBulkDelete,
}: BulkActionBarProps) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 border rounded-lg p-4 flex justify-between items-center">
      <div>
        Выбрано автомобилей: <span className="font-semibold">{selectedCount}</span>
      </div>
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={onClearSelection}>
          Отменить выбор
        </Button>
        <Button variant="destructive" size="sm" onClick={onBulkDelete}>
          Удалить выбранные
        </Button>
      </div>
    </div>
  );
};

export default BulkActionBar;
