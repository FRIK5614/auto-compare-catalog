
import React from 'react';
import { SheetContent } from "@/components/ui/sheet";
import { AdminMenuItems } from './AdminMenuItems';

type MobileAdminSidebarProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activePath: string;
  newOrdersCount: number;
  onNavigate: (path: string) => void;
  onLogout: () => void;
};

export const MobileAdminSidebar: React.FC<MobileAdminSidebarProps> = ({
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
    <SheetContent className="w-[280px] sm:w-[350px]" side="right">
      <AdminMenuItems 
        activePath={activePath}
        newOrdersCount={newOrdersCount}
        onNavigate={handleMenuItemClick}
        onLogout={() => {
          onLogout();
          onOpenChange(false);
        }}
      />
    </SheetContent>
  );
};
