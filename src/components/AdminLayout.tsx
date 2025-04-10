
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';
import { useCars } from '@/hooks/useCars';
import { useToast } from '@/hooks/use-toast';
import { AdminSidebar } from './admin/layout/AdminSidebar';
import { MobileAdminSidebar } from './admin/layout/MobileAdminSidebar';

type AdminLayoutProps = {
  children?: React.ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin, logout } = useAdmin();
  const { orders } = useCars();
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (orders && orders.length > 0) {
      const count = orders.filter(order => order.status === 'new').length;
      setNewOrdersCount(count);
      
      // Добавим отладочную информацию о заказах
      console.log('Loaded orders:', orders);
    }
  }, [orders]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  const handleMenuItemClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из панели администратора"
    });
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Админ панель</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <MobileAdminSidebar 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          newOrdersCount={newOrdersCount}
          onItemClick={handleMenuItemClick}
          onLogout={handleLogout}
        />

        <AdminSidebar 
          newOrdersCount={newOrdersCount}
          onItemClick={handleMenuItemClick}
          onLogout={handleLogout}
        />

        <SidebarInset className="bg-background flex-1 p-0 md:p-2 mt-[60px] md:mt-0">
          {children || <Outlet />}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
