
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import { Menu, Home, Flame, ArrowRightLeft, Heart, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Header = () => {
  const { isAdmin } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { icon: Home, text: "Главная", path: "/" },
    { icon: Flame, text: "Горячие предложения", path: "/hot-offers" }, // Changed Fire to Flame
    { icon: ArrowRightLeft, text: "Сравнение", path: "/compare" },
    { icon: Heart, text: "Избранное", path: "/favorites" },
    ...(isAdmin ? [{ icon: User, text: "Админ панель", path: "/admin" }] : []),
  ];
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">AutoDeal</Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="relative">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <MobileMenu 
            menuItems={menuItems} 
            isOpen={isOpen} 
            onClose={() => setIsOpen(false)} 
          />
        </Sheet>
      </div>
    </header>
  );
};

// Mobile Menu Component
const MobileMenu = ({ 
  menuItems, 
  isOpen, 
  onClose 
}: { 
  menuItems: Array<{icon: any; text: string; path: string}>; 
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <SheetContent 
      side="right" 
      className="w-[80%] sm:w-[350px] bg-gradient-to-br from-white to-blue-50 p-0"
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold mb-2">Меню</h2>
          <p className="text-gray-500 text-sm">Выберите раздел</p>
        </div>
        
        <nav className="flex-grow py-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
                    "hover:bg-auto-blue-100 active:scale-95",
                    "group overflow-hidden relative"
                  )}
                >
                  <span className="bg-gradient-to-r from-auto-blue-100 to-auto-blue-300 p-2 rounded-md text-auto-blue-800">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="font-medium text-gray-700 group-hover:text-auto-blue-700">
                    {item.text}
                  </span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-auto-blue-500 group-hover:w-full transition-all duration-500" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-6 border-t">
          <Button 
            variant="blue" 
            className="w-full group transition-all duration-300 hover:shadow-lg active:scale-95"
            onClick={onClose}
          >
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              Закрыть меню
            </span>
          </Button>
        </div>
      </div>
    </SheetContent>
  );
};

export default Header;
