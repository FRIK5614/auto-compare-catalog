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
const SearchFiltersModal = ({
  isOpen,
  onClose,
  scrollToContactForm
}: SearchFiltersModalProps) => {
  const {
    filter,
    setFilter
  } = useCars();
  const isMobile = useIsMobile();

  // На мобильных устройствах используем Sheet (нижний выдвижной экран)
  if (isMobile) {
    return <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
        <SheetContent side="bottom" className="h-screen w-full max-w-full p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 py-5 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-bold flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-primary" />
                  Фильтры
                </SheetTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => {
                  const newFilter = {};
                  setFilter(newFilter);
                }} className="h-8 text-auto-gray-700 text-xs">
                    Сбросить
                  </Button>
                  <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-600">
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </SheetHeader>
            
            <div className="flex-1 overflow-auto px-4 pt-4">
              <SearchFilters filter={filter} setFilter={setFilter} closeModal={onClose} isInModal={true} />
            </div>
            
            <div className="px-4 py-3 border-t mt-auto bg-white sticky bottom-0">
              <div className="flex flex-col space-y-3">
                <Button onClick={() => {
                onClose();
              }} variant="blue" className="w-full">
                  Применить
                </Button>
                
                {scrollToContactForm && <Button onClick={() => {
                onClose();
                setTimeout(() => scrollToContactForm(), 300);
              }} variant="outline" className="w-full">
                    <HeadphonesIcon className="mr-2 h-5 w-5" />
                    Подобрать через специалиста
                  </Button>}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>;
  }

  // На десктопе используем обычный Dialog
  return <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 py-[100px]">
        <DialogHeader className="px-4 py-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center">
              <Filter className="mr-2 h-5 w-5 text-primary" />
              Фильтры
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => {
              const newFilter = {};
              setFilter(newFilter);
            }} className="h-8 text-auto-gray-700 text-xs">
                Сбросить
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-600">
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-4 max-h-[calc(80vh-190px)] overflow-auto">
          <SearchFilters filter={filter} setFilter={setFilter} closeModal={onClose} isInModal={true} />
        </div>
        
        <div className="p-4 border-t fixed bottom-0 left-0 right-0 bg-white z-50">
          <div className="flex flex-col space-y-3 items-center px-0 justify-end">
            <Button onClick={() => {
            onClose();
          }} variant="blue" className="w-full max-w-xs">
              Применить
            </Button>
            
            {scrollToContactForm && <Button onClick={() => {
            onClose();
            setTimeout(() => scrollToContactForm(), 300);
          }} variant="outline" className="w-full max-w-xs">
                <HeadphonesIcon className="mr-2 h-5 w-5" />
                Подобрать через специалиста
              </Button>}
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default SearchFiltersModal;