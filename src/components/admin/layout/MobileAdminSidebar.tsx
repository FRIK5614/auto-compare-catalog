
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AdminSidebarMenu } from './AdminSidebarMenu';
import { cn } from '@/lib/utils';
import { SheetContent } from '@/components/ui/sheet';

type MobileAdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  newOrdersCount: number;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  onLogout: () => void;
};

export const MobileAdminSidebar: React.FC<MobileAdminSidebarProps> = ({
  isOpen,
  onClose,
  newOrdersCount,
  onItemClick,
  onLogout
}) => {
  return (
    <SheetContent 
      side="right" 
      className="w-[80%] sm:w-[350px] bg-gradient-to-br from-white to-blue-50 p-0"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Панель управления</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <AdminSidebarMenu
            newOrdersCount={newOrdersCount}
            onItemClick={(e, path) => {
              onItemClick(e, path);
              onClose();
            }}
            onLogout={() => {
              onLogout();
              onClose();
            }}
            isMobile={true}
          />
        </div>
      </div>
    </SheetContent>
  );
};
