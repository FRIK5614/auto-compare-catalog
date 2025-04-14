
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  ShoppingCart,
  Phone,
  Menu,
  X,
  Heart,
  ArrowLeft,
  Star,
  ChevronDown,
  Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import { useCars } from "@/hooks/useCars";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteSettings } from "@/lib/constants";
import ChatButton from "@/components/ChatButton";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isAdmin } = useAdmin();
  const { favoriteCars, comparisonCars } = useCars();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleSetMenuClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white shadow-sm transition-transform duration-300 ${
        !isVisible ? "-translate-y-full" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-auto-primary"
            >
              <span className="mr-2 hidden sm:inline">AutoDeal</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-1">
            <Link to="/">
              <Button
                variant={isHomePage ? "default" : "ghost"}
                className="text-sm"
              >
                Главная
              </Button>
            </Link>
            <Link to="/cars">
              <Button
                variant={
                  location.pathname === "/cars" ? "default" : "ghost"
                }
                className="text-sm"
              >
                Каталог
              </Button>
            </Link>
            <Link to="/special-offers">
              <Button
                variant={
                  location.pathname === "/special-offers" ? "default" : "ghost"
                }
                className="text-sm"
              >
                Спецпредложения
              </Button>
            </Link>
            <Link to="/blog">
              <Button
                variant={
                  location.pathname === "/blog" ? "default" : "ghost"
                }
                className="text-sm"
              >
                <Newspaper className="mr-1 h-4 w-4" />
                Блог
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2">
            <Link to="/favorites">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {favoriteCars.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-auto-primary text-[10px] text-white">
                    {favoriteCars.length}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/compare">
              <Button variant="ghost" size="icon" className="relative">
                <Star className="h-5 w-5" />
                {comparisonCars.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-auto-primary text-[10px] text-white">
                    {comparisonCars.length}
                  </span>
                )}
              </Button>
            </Link>

            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <ChatButton />

            <a
              href={`tel:${siteSettings.phoneNumber}`}
              className="hidden md:flex items-center"
            >
              <Button variant="ghost" size="sm" className="gap-2 text-sm">
                <Phone className="h-4 w-4" />
                {siteSettings.phoneNumber}
              </Button>
            </a>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isMobile ? "bottom" : "right"} className="h-[90%] md:max-w-sm">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between py-2">
                    <h2 className="text-lg font-semibold">Меню</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSetMenuClose}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="mt-4 flex flex-col space-y-1">
                    <Link to="/" onClick={handleSetMenuClose}>
                      <Button
                        variant={isHomePage ? "default" : "ghost"}
                        className="w-full justify-start text-base"
                      >
                        Главная
                      </Button>
                    </Link>
                    <Link to="/cars" onClick={handleSetMenuClose}>
                      <Button
                        variant={
                          location.pathname === "/cars" ? "default" : "ghost"
                        }
                        className="w-full justify-start text-base"
                      >
                        Каталог
                      </Button>
                    </Link>
                    <Link to="/special-offers" onClick={handleSetMenuClose}>
                      <Button
                        variant={
                          location.pathname === "/special-offers"
                            ? "default"
                            : "ghost"
                        }
                        className="w-full justify-start text-base"
                      >
                        Спецпредложения
                      </Button>
                    </Link>
                    <Link to="/blog" onClick={handleSetMenuClose}>
                      <Button
                        variant={
                          location.pathname === "/blog" ? "default" : "ghost"
                        }
                        className="w-full justify-start text-base"
                      >
                        <Newspaper className="mr-2 h-4 w-4" />
                        Блог
                      </Button>
                    </Link>
                    <Link to="/favorites" onClick={handleSetMenuClose}>
                      <Button
                        variant={
                          location.pathname === "/favorites"
                            ? "default"
                            : "ghost"
                        }
                        className="w-full justify-start text-base"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Избранное{" "}
                        {favoriteCars.length > 0 && (
                          <span className="ml-1 rounded-full bg-auto-primary px-1.5 py-0.5 text-xs text-white">
                            {favoriteCars.length}
                          </span>
                        )}
                      </Button>
                    </Link>
                    <Link to="/compare" onClick={handleSetMenuClose}>
                      <Button
                        variant={
                          location.pathname === "/compare"
                            ? "default"
                            : "ghost"
                        }
                        className="w-full justify-start text-base"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Сравнение{" "}
                        {comparisonCars.length > 0 && (
                          <span className="ml-1 rounded-full bg-auto-primary px-1.5 py-0.5 text-xs text-white">
                            {comparisonCars.length}
                          </span>
                        )}
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={handleSetMenuClose}>
                        <Button
                          variant={
                            location.pathname.startsWith("/admin")
                              ? "default"
                              : "ghost"
                          }
                          className="w-full justify-start text-base"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Панель управления
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div className="mt-auto">
                    <a
                      href={`tel:${siteSettings.phoneNumber}`}
                      className="flex items-center justify-center rounded-md border border-gray-200 px-4 py-3 hover:bg-gray-50"
                    >
                      <Phone className="mr-2 h-5 w-5 text-auto-primary" />
                      <span className="font-medium">
                        {siteSettings.phoneNumber}
                      </span>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
