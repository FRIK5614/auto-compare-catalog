
import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminNavigation } from './AdminNavigation';

type AdminHeaderProps = {
  newOrdersCount: number;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onOpenMenu: () => void;
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  newOrdersCount,
  onNavigate,
  onLogout,
  onOpenMenu
}) => {
  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="container mx-auto py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="mr-4">
              <h2 className="text-xl font-semibold">Админ панель</h2>
            </div>
            
            <AdminNavigation 
              newOrdersCount={newOrdersCount} 
              onNavigate={onNavigate}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="hidden md:flex"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onOpenMenu}
              className="md:hidden"
            >
              <Menu className="h-4 w-4 mr-2" />
              Меню
              {newOrdersCount > 0 && (
                <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                  {newOrdersCount}
                </span>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onOpenMenu}
              className="hidden md:flex"
            >
              Все разделы
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
