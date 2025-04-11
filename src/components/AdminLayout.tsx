
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useCars } from '@/hooks/useCars';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  CarFront, 
  ShoppingCart, 
  LogOut, 
  FileArchive, 
  Package,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
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

  const menuItems = [
    { icon: BarChart3, label: 'Главная', path: '/admin' },
    { icon: CarFront, label: 'Автомобили', path: '/admin/cars' },
    { icon: ShoppingCart, label: 'Заказы', path: '/admin/orders', badge: newOrdersCount },
    { icon: FileArchive, label: 'Импорт данных', path: '/admin/import' },
    { icon: Package, label: 'Каталог TMC', path: '/admin/tmcavto-catalog' },
    { icon: Settings, label: 'Настройки', path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };

  const renderMenu = () => (
    <div className="space-y-2 py-4">
      <div className="px-4 mb-4">
        <h2 className="text-lg font-medium">Меню</h2>
        <p className="text-sm text-muted-foreground">Выберите раздел</p>
      </div>
      
      {menuItems.map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? "secondary" : "ghost"}
          className="w-full justify-start relative"
          onClick={() => handleMenuItemClick(item.path)}
        >
          <item.icon className="h-5 w-5 mr-2" />
          <span>{item.label}</span>
          {item.badge && item.badge > 0 && (
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {item.badge}
            </span>
          )}
        </Button>
      ))}
      
      <div className="px-4 mt-6">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span>Выйти</span>
        </Button>
      </div>
    </div>
  );

  const renderMobileMenu = () => (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetContent className="w-[280px] sm:w-[350px]" side="right">
        {renderMenu()}
      </SheetContent>
    </Sheet>
  );

  const renderDesktopMenu = () => (
    <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DrawerContent className="max-h-[85vh]">
        {renderMenu()}
        <div className="p-4 mt-4 border-t">
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            Закрыть меню
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="mr-4">
                <h2 className="text-xl font-semibold">Админ панель</h2>
              </div>
              
              <nav className="hidden md:flex items-center gap-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    size="sm"
                    className="relative"
                    onClick={() => handleMenuItemClick(item.path)}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="hidden md:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
              
              <SheetTrigger asChild className="md:hidden">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsMenuOpen(true)}
                >
                  Меню
                  {newOrdersCount > 0 && (
                    <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                      {newOrdersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              
              <DrawerTrigger asChild className="hidden md:flex">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsMenuOpen(true)}
                >
                  Все разделы
                </Button>
              </DrawerTrigger>
            </div>
          </div>
        </div>
      </header>
      
      {isMobile ? renderMobileMenu() : renderDesktopMenu()}
      
      <main className="flex-1 overflow-y-auto p-4">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
