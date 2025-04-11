
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useCars } from '@/hooks/useCars';
import { useToast } from '@/hooks/use-toast';
import { AdminHeader } from './admin/layout/AdminHeader';
import { AdminSidebarMenu } from './admin/layout/AdminSidebarMenu';

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
        onItemClick={handleMenuItemClick}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-y-auto p-4">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
