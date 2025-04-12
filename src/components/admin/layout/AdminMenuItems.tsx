
import React from 'react';
import { 
  BarChart3, 
  CarFront, 
  ShoppingCart, 
  LogOut, 
  FileArchive, 
  Package,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export type MenuItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
};

type AdminMenuItemsProps = {
  activePath: string;
  newOrdersCount: number;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  includeLogout?: boolean;
};

export const getMenuItems = (newOrdersCount: number): MenuItem[] => [
  { icon: BarChart3, label: 'Главная', path: '/admin' },
  { icon: CarFront, label: 'Автомобили', path: '/admin/cars' },
  { icon: ShoppingCart, label: 'Заказы', path: '/admin/orders', badge: newOrdersCount },
  { icon: FileArchive, label: 'Импорт данных', path: '/admin/import' },
  { icon: Package, label: 'Каталог TMC', path: '/admin/tmcavto-catalog' },
  { icon: Settings, label: 'Настройки', path: '/admin/settings' },
];

export const AdminMenuItems: React.FC<AdminMenuItemsProps> = ({
  activePath,
  newOrdersCount,
  onNavigate,
  onLogout,
  includeLogout = true
}) => {
  const menuItems = getMenuItems(newOrdersCount);
  
  const isActive = (path: string) => {
    return activePath === path || 
          (path !== '/admin' && activePath.startsWith(path));
  };

  return (
    <div className="space-y-2 py-4">
      <div className="px-4 mb-4">
        <h2 className="text-lg font-medium">Меню</h2>
        <p className="text-sm text-muted-foreground">Выберите раздел</p>
      </div>
      
      {menuItems.map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? "secondary" : "ghost"}
          className="w-full justify-start relative"
          onClick={() => onNavigate(item.path)}
        >
          <item.icon className="h-5 w-5 mr-2" />
          <span>{item.label}</span>
          {item.badge && item.badge > 0 && (
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {item.badge}
            </span>
          )}
        </Button>
      ))}
      
      {includeLogout && (
        <div className="px-4 mt-6">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span>Выйти</span>
          </Button>
        </div>
      )}
    </div>
  );
};
