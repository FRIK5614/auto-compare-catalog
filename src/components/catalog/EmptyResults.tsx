
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface EmptyResultsProps {
  onOpenFilterModal: () => void;
}

export const EmptyResults: React.FC<EmptyResultsProps> = ({ onOpenFilterModal }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg text-center">
      <div className="w-16 h-16 bg-auto-gray-100 rounded-full flex items-center justify-center mb-4">
        <ArrowUpDown className="h-8 w-8 text-auto-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-auto-gray-700 mb-2">Автомобили не найдены</h3>
      <p className="text-auto-gray-500 mb-6">
        По выбранным фильтрам не найдено ни одного автомобиля. Попробуйте изменить параметры поиска.
      </p>
      <Button variant="blue" onClick={onOpenFilterModal}>
        Изменить фильтры
      </Button>
    </div>
  );
};
