
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel 
} from '@/components/ui/sidebar';
import { AdminSidebarMenu } from './AdminSidebarMenu';

type AdminSidebarContentProps = {
  newOrdersCount: number;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  onLogout: () => void;
};

export const AdminSidebarContent: React.FC<AdminSidebarContentProps> = ({ 
  newOrdersCount, 
  onItemClick,
  onLogout
}) => {
  const location = useLocation();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Административная панель</SidebarGroupLabel>
        <SidebarGroupContent>
          <AdminSidebarMenu
            newOrdersCount={newOrdersCount}
            onItemClick={onItemClick}
            onLogout={onLogout}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
