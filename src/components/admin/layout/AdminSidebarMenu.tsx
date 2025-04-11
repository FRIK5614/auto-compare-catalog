
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  SidebarMenu
} from '@/components/ui/sidebar';
import { 
  CarFront, 
  LogOut, 
  Settings, 
  ShoppingCart, 
  BarChart3,
  FileArchive,
  Package,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { SidebarMenuSection, MenuItemType } from './SidebarMenuSection';
import { MobileSidebarMenu } from './MobileSidebarMenu';
import { useSidebar } from '@/components/ui/sidebar';
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
  const { state, toggleSidebar } = useSidebar();

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
    <div className="flex flex-col h-full">
      <SidebarMenu className="overflow-y-auto flex-1">
        {menuSections.flatMap(section => (
          <SidebarMenuSection
            key={section.title}
            title={section.title}
            items={section.items}
            onItemClick={onItemClick}
            isActive={isActive}
          />
        ))}
      </SidebarMenu>
      
      <div className="mt-auto p-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center mb-2"
        >
          {state === "expanded" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {state === "expanded" && <span className="ml-2">Свернуть</span>}
        </Button>
      </div>
    </div>
  );
};
