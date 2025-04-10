
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
  Cog, 
  ShoppingCart, 
  BarChart3, 
  FileArchive, 
  Package,
  MessageCircle
} from 'lucide-react';

type AdminMenuProps = {
  newOrdersCount: number;
  newMessagesCount: number;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  onLogout: () => void;
  isMobile?: boolean;
};

export const AdminSidebarMenu: React.FC<AdminMenuProps> = ({ 
  newOrdersCount, 
  newMessagesCount, 
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

  if (isMobile) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Управление</h3>
          <div className="space-y-1">
            <Button 
              variant={isActive('/admin') || isActive('/admin/dashboard') ? 'secondary' : 'ghost'} 
              className="w-full justify-start" 
              onClick={(e) => onItemClick(e as any, "/admin")}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              <span>Главная</span>
            </Button>
            <Button 
              variant={isActive('/admin/cars') ? 'secondary' : 'ghost'} 
              className="w-full justify-start" 
              onClick={(e) => onItemClick(e as any, "/admin/cars")}
            >
              <CarFront className="h-5 w-5 mr-2" />
              <span>Автомобили</span>
            </Button>
            <Button 
              variant={isActive('/admin/orders') ? 'secondary' : 'ghost'} 
              className="w-full justify-start" 
              onClick={(e) => onItemClick(e as any, "/admin/orders")}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span>Заказы</span>
              {newOrdersCount > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {newOrdersCount}
                </span>
              )}
            </Button>
            <Button 
              variant={isActive('/admin/chat') ? 'secondary' : 'ghost'} 
              className="w-full justify-start" 
              onClick={(e) => onItemClick(e as any, "/admin/chat")}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              <span>Чат</span>
              {newMessagesCount > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {newMessagesCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Импорт/Экспорт</h3>
          <div className="space-y-1">
            <Button 
              variant={isActive('/admin/import') ? 'secondary' : 'ghost'} 
              className="w-full justify-start" 
              onClick={(e) => onItemClick(e as any, "/admin/import")}
            >
              <FileArchive className="h-5 w-5 mr-2" />
              <span>Импорт данных</span>
            </Button>
            <Button 
              variant={isActive('/admin/tmcavto-catalog') ? 'secondary' : 'ghost'} 
              className="w-full justify-start" 
              onClick={(e) => onItemClick(e as any, "/admin/tmcavto-catalog")}
            >
              <Package className="h-5 w-5 mr-2" />
              <span>Каталог TMC Авто</span>
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Система</h3>
          <div className="space-y-1">
            <Button 
              variant={isActive('/admin/settings') ? 'secondary' : 'ghost'} 
              className="w-full justify-start" 
              onClick={(e) => onItemClick(e as any, "/admin/settings")}
            >
              <Cog className="h-5 w-5 mr-2" />
              <span>Настройки</span>
            </Button>
          </div>
        </div>

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
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          className={isActive('/admin') || isActive('/admin/dashboard') ? 'bg-accent text-accent-foreground' : ''}
        >
          <a href="#" onClick={(e) => onItemClick(e, "/admin")}>
            <BarChart3 className="h-5 w-5" />
            <span>Главная</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild
          className={isActive('/admin/cars') ? 'bg-accent text-accent-foreground' : ''}
        >
          <a href="#" onClick={(e) => onItemClick(e, "/admin/cars")}>
            <CarFront className="h-5 w-5" />
            <span>Автомобили</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild
          className={isActive('/admin/orders') ? 'bg-accent text-accent-foreground' : ''}
        >
          <a href="#" onClick={(e) => onItemClick(e, "/admin/orders")}>
            <ShoppingCart className="h-5 w-5" />
            <span>Заказы</span>
            {newOrdersCount > 0 && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {newOrdersCount}
              </span>
            )}
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild
          className={isActive('/admin/chat') ? 'bg-accent text-accent-foreground' : ''}
        >
          <a href="#" onClick={(e) => onItemClick(e, "/admin/chat")}>
            <MessageCircle className="h-5 w-5" />
            <span>Чат</span>
            {newMessagesCount > 0 && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {newMessagesCount}
              </span>
            )}
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
