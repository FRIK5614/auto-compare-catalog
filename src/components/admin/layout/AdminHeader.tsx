
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';

type AdminHeaderProps = {
  newOrdersCount: number;
  onNavigate: (path: string) => void;
  onLogout: () => void;
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  newOrdersCount,
  onNavigate,
  onLogout,
}) => {
  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="container mx-auto py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold text-auto-primary">
              AutoDeal
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      Главная
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/admin/cars">
                    <Button variant="ghost" size="sm">
                      Автомобили
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/admin/orders">
                    <Button variant="ghost" size="sm" className="relative">
                      Заказы
                      {newOrdersCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                          {newOrdersCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/admin/blog">
                    <Button variant="ghost" size="sm">
                      Блог
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/admin/settings">
                    <Button variant="ghost" size="sm">
                      Настройки
                    </Button>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
