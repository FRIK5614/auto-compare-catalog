
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  CarFront, 
  ShoppingCart, 
  FileArchive, 
  Package,
  Settings,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type MenuItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
};

type AdminNavigationProps = {
  newOrdersCount: number;
  onNavigate: (path: string) => void;
};

export const AdminNavigation: React.FC<AdminNavigationProps> = ({ 
  newOrdersCount,
  onNavigate 
}) => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { icon: BarChart3, label: 'Главная', path: '/admin' },
    { icon: CarFront, label: 'Автомобили', path: '/admin/cars' },
    { icon: ShoppingCart, label: 'Заказы', path: '/admin/orders', badge: newOrdersCount },
    { icon: FileArchive, label: 'Импорт данных', path: '/admin/import' },
    { icon: MessageCircle, label: 'Чат', path: '/admin/chat' },
    { icon: Settings, label: 'Настройки', path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
          (path !== '/admin' && location.pathname.startsWith(path));
  };

  return (
    <nav className="hidden md:flex items-center gap-2">
      {menuItems.map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? "secondary" : "ghost"}
          size="sm"
          className="relative"
          onClick={() => onNavigate(item.path)}
        >
          <item.icon className="h-4 w-4 mr-2" />
          <span>{item.label}</span>
          {item.badge && item.badge > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {item.badge}
            </span>
          )}
        </Button>
      ))}
    </nav>
  );
};
