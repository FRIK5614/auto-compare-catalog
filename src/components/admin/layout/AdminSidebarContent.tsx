
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel 
} from '@/components/ui/sidebar';
import { AdminSidebarMenu } from './AdminSidebarMenu';
import { 
  FileArchive, 
  Package,
  Cog
} from 'lucide-react';

type AdminSidebarContentProps = {
  newOrdersCount: number;
  newMessagesCount: number;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
};

export const AdminSidebarContent: React.FC<AdminSidebarContentProps> = ({ 
  newOrdersCount, 
  newMessagesCount, 
  onItemClick 
}) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Управление</SidebarGroupLabel>
        <SidebarGroupContent>
          <AdminSidebarMenu
            newOrdersCount={newOrdersCount}
            newMessagesCount={newMessagesCount}
            onItemClick={onItemClick}
            onLogout={() => {}} // Unused in desktop view
          />
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup className="mt-4">
        <SidebarGroupLabel>Импорт/Экспорт</SidebarGroupLabel>
        <SidebarGroupContent>
          <AdminSidebarMenu
            newOrdersCount={0}
            newMessagesCount={0}
            onItemClick={onItemClick}
            onLogout={() => {}} // Unused
            isMobile={false}
          />
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup className="mt-4">
        <SidebarGroupLabel>Система</SidebarGroupLabel>
        <SidebarGroupContent>
          <AdminSidebarMenu
            newOrdersCount={0}
            newMessagesCount={0}
            onItemClick={onItemClick}
            onLogout={() => {}} // Unused
            isMobile={false}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
