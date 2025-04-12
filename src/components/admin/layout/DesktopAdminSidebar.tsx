
import React from 'react';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { AdminMenuItems } from './AdminMenuItems';

type DesktopAdminSidebarProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activePath: string;
  newOrdersCount: number;
  onNavigate: (path: string) => void;
  onLogout: () => void;
};

export const DesktopAdminSidebar: React.FC<DesktopAdminSidebarProps> = ({
  isOpen,
  onOpenChange,
  activePath,
  newOrdersCount,
  onNavigate,
  onLogout
}) => {
  const handleMenuItemClick = (path: string) => {
    onNavigate(path);
    onOpenChange(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <AdminMenuItems 
          activePath={activePath}
          newOrdersCount={newOrdersCount}
          onNavigate={handleMenuItemClick}
          onLogout={() => {
            onLogout();
            onOpenChange(false);
          }}
        />
        <div className="p-4 mt-4 border-t">
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Закрыть меню
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
