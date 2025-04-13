
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useCars } from '@/hooks/useCars';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  AdminHeader, 
  MobileAdminSidebar, 
  DesktopAdminSidebar 
} from '@/components/admin/layout';
import { Sheet } from '@/components/ui/sheet';
import { Drawer } from '@/components/ui/drawer';

type AdminLayoutProps = {
  children?: React.ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin, logout } = useAdmin();
  const { orders, reloadOrders } = useCars();
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Load orders on initial mount and when navigating to orders page
  useEffect(() => {
    const loadOrdersData = async () => {
      if (location.pathname.includes('/admin/orders')) {
        await reloadOrders();
      }
    };
    
    loadOrdersData();
  }, [location.pathname, reloadOrders]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const count = orders.filter(order => order.status === 'new').length;
      setNewOrdersCount(count);
    }
  }, [orders]);

  useEffect(() => {
    if (!isAdmin && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate, location.pathname]);

  if (!isAdmin && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" />;
  }

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из панели администратора"
    });
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AdminHeader 
        newOrdersCount={newOrdersCount}
        onNavigate={handleMenuItemClick}
        onLogout={handleLogout}
        onOpenMenu={() => setIsMenuOpen(true)}
      />
      
      {isMobile ? (
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <MobileAdminSidebar 
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            activePath={location.pathname}
            newOrdersCount={newOrdersCount}
            onNavigate={handleMenuItemClick}
            onLogout={handleLogout}
          />
        </Sheet>
      ) : (
        <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DesktopAdminSidebar 
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            activePath={location.pathname}
            newOrdersCount={newOrdersCount}
            onNavigate={handleMenuItemClick}
            onLogout={handleLogout}
          />
        </Drawer>
      )}
      
      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
