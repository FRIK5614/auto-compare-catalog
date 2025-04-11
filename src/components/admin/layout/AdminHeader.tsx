
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useState } from 'react';
import { MobileAdminSidebar } from './MobileAdminSidebar';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';

type AdminHeaderProps = {
  newOrdersCount: number;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  newOrdersCount,
  onItemClick
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из панели администратора"
    });
    navigate('/');
  };

  return (
    <header className="bg-white border-b py-3 px-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold mr-4">Админ панель</h2>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
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
            onLogout={handleLogout}
          />
        </Sheet>
      </div>
    </header>
  );
};
