
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { 
  CarFront, 
  LogOut, 
  Settings, 
  ShoppingCart, 
  BarChart3,
  FileArchive,
  Package,
  Loader2
} from 'lucide-react';

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
  const navigate = useNavigate();

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
      title: "Импорт/Экспорт",
      items: [
        { icon: FileArchive, title: "Импорт данных", path: "/admin/import" },
        { icon: Package, title: "Каталог TMC Авто", path: "/admin/tmcavto-catalog" },
      ]
    },
    {
      title: "Система",
      items: [
        { icon: Settings, title: "Настройки", path: "/admin/settings" },
      ]
    }
  ];

  if (isMobile) {
    return (
      <div className="space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Button 
                  key={item.path}
                  variant={isActive(item.path) ? 'secondary' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={(e) => onItemClick(e as any, item.path)}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  <span>{item.title}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6">
          <Button 
            variant="default" 
            className="w-full" 
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarMenu>
      {menuSections.flatMap(section => 
        section.items.map(item => (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton 
              asChild 
              className={isActive(item.path) ? 'bg-accent text-accent-foreground' : ''}
            >
              <a href="#" onClick={(e) => onItemClick(e, item.path)}>
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))
      )}
    </SidebarMenu>
  );
};
