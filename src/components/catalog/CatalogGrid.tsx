
import React from "react";
import { Car } from "@/types/car";
import CarCard from "@/components/CarCard";
import { PaginationControls } from "./PaginationControls";

interface CatalogGridProps {
  cars: Car[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CatalogGrid: React.FC<CatalogGridProps> = ({
  cars,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      
      <PaginationControls 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={onPageChange} 
      />
    </>
  );
};
