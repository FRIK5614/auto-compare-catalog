
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AdminSidebarMenu } from './AdminSidebarMenu';

type MobileAdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  newOrdersCount: number;
  newMessagesCount: number;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  onLogout: () => void;
};

export const MobileAdminSidebar: React.FC<MobileAdminSidebarProps> = ({
  isOpen,
  onClose,
  newOrdersCount,
  newMessagesCount,
  onItemClick,
  onLogout
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="md:hidden fixed inset-0 bg-black/50 z-40"
      onClick={onClose}
    >
      <div 
        className="bg-background h-full w-64 p-4 overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Меню</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <AdminSidebarMenu
          newOrdersCount={newOrdersCount}
          newMessagesCount={newMessagesCount}
          onItemClick={(e, path) => {
            onItemClick(e, path);
            onClose();
          }}
          onLogout={onLogout}
          isMobile={true}
        />
      </div>
    </div>
  );
};
