
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SearchFilters from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { X, HeadphonesIcon, Filter } from "lucide-react";
import { useCars } from "@/hooks/useCars";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  scrollToContactForm?: () => void;
}

const SearchFiltersModal = ({ isOpen, onClose, scrollToContactForm }: SearchFiltersModalProps) => {
  const { filter, setFilter } = useCars();
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[100vh] sm:max-w-full p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold flex items-center">
                <Filter className="mr-2 h-5 w-5 text-primary" />
                Фильтры
              </SheetTitle>
              <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-muted">
                <X className="h-5 w-5" />
              </SheetClose>
            </div>
          </SheetHeader>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4">
              <SearchFilters 
                filter={filter} 
                setFilter={setFilter} 
                closeModal={onClose} 
                isInModal={true} 
              />
            </div>
          </div>
          
          <div className="p-4 border-t mt-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={onClose} 
                className="w-full"
              >
                Применить фильтры
              </Button>
              
              {scrollToContactForm && (
                <Button 
                  onClick={() => {
                    onClose();
                    setTimeout(() => scrollToContactForm(), 300);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <HeadphonesIcon className="mr-2 h-5 w-5" />
                  Подобрать через специалиста
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SearchFiltersModal;
