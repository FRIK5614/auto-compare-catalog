
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AdminSidebarMenu } from './AdminSidebarMenu';
import { cn } from '@/lib/utils';

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
      className="md:hidden fixed inset-0 bg-black/50 z-40 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className={cn(
          "bg-gradient-to-br from-white to-blue-50 h-full w-[80%] sm:w-[350px] p-4 overflow-y-auto",
          "animate-slideInRight shadow-xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
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
