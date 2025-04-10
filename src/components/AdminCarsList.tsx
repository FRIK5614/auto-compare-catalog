
import React, { useState, useEffect } from "react";
import { Car } from "@/types/car";
import { CarDeleteDialog } from "@/components/admin/car-form";
import {
  CarSearchBar,
  CarTable,
  CarListPagination,
  BulkActionBar
} from "@/components/admin/car-list";

interface AdminCarsListProps {
  cars: Car[];
  onEdit: (carId: string) => void;
  onDelete: (carId: string) => void;
  onView: (carId: string) => void;
  loading?: boolean;
}

const AdminCarsList = ({ 
  cars, 
  onEdit, 
  onDelete, 
  onView, 
  loading = false 
}: AdminCarsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const carsPerPage = 12;
  
  // Filter cars when search query or cars array changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCars(cars);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = cars.filter(car => 
        car.brand.toLowerCase().includes(lowerCaseQuery) || 
        car.model.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredCars(filtered);
      // Reset to page 1 when search changes
      setCurrentPage(1);
    }
  }, [searchQuery, cars]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCars(currentCars.map(car => car.id));
    } else {
      setSelectedCars([]);
    }
  };
  
  const handleSelectCar = (carId: string, checked: boolean) => {
    if (checked) {
      setSelectedCars(prev => [...prev, carId]);
    } else {
      setSelectedCars(prev => prev.filter(id => id !== carId));
    }
  };

  const handleDeleteClick = (car: Car) => {
    setCarToDelete(car);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (carToDelete) {
      onDelete(carToDelete.id);
      setCarToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleBulkDelete = () => {
    // Implementation for bulk delete will be added later
    console.log('Delete selected cars:', selectedCars);
    // Clear selection after deletion
    setSelectedCars([]);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <CarSearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
      </div>
      
      <CarTable
        cars={currentCars}
        selectedCars={selectedCars}
        loading={loading}
        searchQuery={searchQuery}
        onSelectAll={handleSelectAll}
        onSelectCar={handleSelectCar}
        onView={onView}
        onEdit={onEdit}
        onDelete={handleDeleteClick}
      />
      
      <CarListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      
      <BulkActionBar
        selectedCount={selectedCars.length}
        onClearSelection={() => setSelectedCars([])}
        onBulkDelete={handleBulkDelete}
      />
      
      <CarDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        carName={carToDelete ? `${carToDelete.brand} ${carToDelete.model}` : undefined}
      />
    </div>
  );
};

export default AdminCarsList;
