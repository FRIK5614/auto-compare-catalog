
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SearchFilters from "@/components/search-filters";
import { Button } from "@/components/ui/button";
import { HeadphonesIcon, Filter, X } from "lucide-react";
import { useCars } from "@/hooks/useCars";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  scrollToContactForm?: () => void;
}

const SearchFiltersModal = ({ isOpen, onClose, scrollToContactForm }: SearchFiltersModalProps) => {
  const { filter, setFilter } = useCars();
  const isMobile = useIsMobile();
  
  // На мобильных устройствах используем Sheet (нижний выдвижной экран)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="bottom" className="h-screen w-full max-w-full p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 py-4 border-b"> {/* Увеличил отступы py-4 */}
              <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-bold flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-primary" />
                  Фильтры
                </SheetTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  className="text-gray-600"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </SheetHeader>
            
            <div className="flex-1 overflow-auto px-4 pt-2"> {/* Добавил отступы */}
              <SearchFilters 
                filter={filter} 
                setFilter={setFilter} 
                closeModal={onClose} 
                isInModal={true} 
              />
            </div>
            
            {scrollToContactForm && (
              <div className="p-4 border-t mt-auto">
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
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  
  // На десктопе используем обычный Dialog
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center">
              <Filter className="mr-2 h-5 w-5 text-primary" />
              Фильтры
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="p-4 max-h-[80vh] overflow-auto">
          <SearchFilters 
            filter={filter} 
            setFilter={setFilter} 
            closeModal={onClose} 
            isInModal={true} 
          />
        </div>
        
        {scrollToContactForm && (
          <div className="p-4 border-t">
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchFiltersModal;

