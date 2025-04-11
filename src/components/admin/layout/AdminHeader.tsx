
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { MobileAdminSidebar } from './MobileAdminSidebar';
import { AdminSidebarMenu } from './AdminSidebarMenu';

type AdminHeaderProps = {
  newOrdersCount: number;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  onLogout: () => void;
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  newOrdersCount,
  onItemClick,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold mr-4">Админ панель</h2>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            <AdminSidebarMenu
              newOrdersCount={newOrdersCount}
              onItemClick={onItemClick}
              onLogout={onLogout}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="hidden md:flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
                {newOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {newOrdersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <MobileAdminSidebar 
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              newOrdersCount={newOrdersCount}
              onItemClick={onItemClick}
              onLogout={onLogout}
            />
          </Sheet>
        </div>
      </div>
    </header>
  );
};
