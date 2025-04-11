
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  CarFront, 
  LogOut, 
  Settings, 
  ShoppingCart, 
  BarChart3,
  FileArchive,
  Package
} from 'lucide-react';
import { SidebarMenuSection, MenuItemType } from './SidebarMenuSection';
import { MobileSidebarMenu } from './MobileSidebarMenu';
import { Button } from '@/components/ui/button';

type AdminMenuProps = {
  newOrdersCount: number;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  onLogout: () => void;
  isMobile?: boolean;
};

export const AdminSidebarMenu: React.FC<AdminMenuProps> = ({ 
  newOrdersCount, 
  onItemClick, 
  onLogout,
  isMobile = false
}) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };

  // Define menu sections with their items
  const menuSections = [
    {
      title: "Управление",
      items: [
        { icon: BarChart3, title: "Главная", path: "/admin" },
        { icon: CarFront, title: "Автомобили", path: "/admin/cars" },
        { icon: ShoppingCart, title: "Заказы", path: "/admin/orders", badge: newOrdersCount },
      ]
    },
    {
      title: "Каталог",
      items: [
        { icon: FileArchive, title: "Импорт данных", path: "/admin/import" },
        { icon: Package, title: "Каталог TMC", path: "/admin/tmcavto-catalog" },
      ]
    },
    {
      title: "Настройки",
      items: [
        { icon: Settings, title: "Настройки", path: "/admin/settings" },
      ]
    }
  ];

  if (isMobile) {
    return (
      <MobileSidebarMenu
        menuSections={menuSections}
        onItemClick={onItemClick}
        onLogout={onLogout}
        isActive={isActive}
      />
    );
  }

  return (
    <div className="space-y-6">
      {menuSections.map((section, idx) => (
        <div key={idx} className="mb-6">
          <SidebarMenuSection
            title={section.title}
            items={section.items}
            onItemClick={onItemClick}
            isActive={isActive}
          />
        </div>
      ))}
      
      <div className="pt-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Выйти
        </Button>
      </div>
    </div>
  );
};
