
import React from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useCars } from '@/hooks/useCars';
import { useToast } from '@/hooks/use-toast';
import { AdminHeader } from '@/components/admin/layout';

type AdminLayoutProps = {
  children?: React.ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin, logout } = useAdmin();
  const { orders } = useCars();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  if (!isAdmin && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" />;
  }

  const handleMenuItemClick = (path: string) => {
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

  const newOrdersCount = orders?.filter(order => order.status === 'new').length || 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AdminHeader 
        newOrdersCount={newOrdersCount}
        onNavigate={handleMenuItemClick}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
