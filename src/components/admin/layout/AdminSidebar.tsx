
import React from 'react';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarFooter 
} from '@/components/ui/sidebar';
import { AdminSidebarContent } from './AdminSidebarContent';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

type AdminSidebarProps = {
  newOrdersCount: number;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  onLogout: () => void;
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  newOrdersCount,
  onItemClick,
  onLogout
}) => {
  return (
    <Sidebar className="hidden md:flex">
      <SidebarHeader className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Панель администратора</h2>
      </SidebarHeader>
      
      <AdminSidebarContent 
        newOrdersCount={newOrdersCount}
        onItemClick={onItemClick}
        onLogout={onLogout}
      />
      
      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
