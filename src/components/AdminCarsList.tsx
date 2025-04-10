
import React, { useState, useEffect } from "react";
import { Car } from "@/types/car";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, Edit, Trash, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CarDeleteDialog } from "@/components/admin/car-form";

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
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            isActive={currentPage === 1} 
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Add ellipsis if current page is not close to first page
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Calculate range of visible pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust range if at edges
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add visible pages
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Add ellipsis if current page is not close to last page
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск по марке или модели..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCars.length > 0 && selectedCars.length === currentCars.length}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
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
              ) : currentCars.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-gray-500">
                      {searchQuery ? "По запросу ничего не найдено" : "Автомобили не найдены"}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCars.includes(car.id)}
                        onCheckedChange={(checked) => handleSelectCar(car.id, !!checked)}
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
                          onClick={() => handleDeleteClick(car)}
                          title="Удалить"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {generatePaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
      {selectedCars.length > 0 && (
        <div className="bg-gray-50 border rounded-lg p-4 flex justify-between items-center">
          <div>
            Выбрано автомобилей: <span className="font-semibold">{selectedCars.length}</span>
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedCars([])}>
              Отменить выбор
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              Удалить выбранные
            </Button>
          </div>
        </div>
      )}

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
