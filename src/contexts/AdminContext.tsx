import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car, Order } from '../types/car';
import { useCars as useGlobalCars } from './CarsContext';
import { useToast } from '@/hooks/use-toast';

// Define site configuration types
export type SiteConfig = {
  siteName: string;
  siteDescription: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  contactPhone: string;
  footerText: string;
  catalog?: {
    itemsPerPage: number;
    defaultSorting: string;
    enableFiltering: boolean;
    enableComparison: boolean;
    enableFavorites: boolean;
    hotOffersCount: number;
    featuredCarsCount: number;
  };
  telegram?: {
    botToken?: string;
    adminChatId?: string;
    notifyOnNewOrder: boolean;
    notifyOnMessage: boolean;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
    googleAnalyticsId?: string;
    yandexMetrikaId?: string;
  };
  appearance?: {
    primaryColor: string;
    secondaryColor: string;
    bannerImage?: string;
    bannerTitle?: string;
    bannerText?: string;
  };
  content?: {
    home: {
      title: string;
      subtitle: string;
      description: string;
    };
    about: {
      title: string;
      content: string;
    };
    contact: {
      address: string;
      worktime: string;
      mapCode?: string;
    };
  };
};

// Default configuration
const DEFAULT_CONFIG: SiteConfig = {
  siteName: 'TMC Авто',
  siteDescription: 'Продажа автомобилей',
  contactEmail: 'info@tmcavto.ru',
  contactPhone: '+7 (999) 123-45-67',
  footerText: '© 2023 TMC Авто. Все права защищены.',
  catalog: {
    itemsPerPage: 12,
    defaultSorting: 'price-asc',
    enableFiltering: true,
    enableComparison: true,
    enableFavorites: true,
    hotOffersCount: 8,
    featuredCarsCount: 6
  },
  telegram: {
    notifyOnNewOrder: true,
    notifyOnMessage: true
  },
  seo: {
    metaTitle: 'TMC Авто - Продажа автомобилей',
    metaDescription: 'Большой выбор автомобилей от TMC Авто',
  },
  content: {
    home: {
      title: 'TMC Авто - Продажа автомобилей',
      subtitle: 'Большой выбор автомобилей по доступным ценам',
      description: 'TMC Авто предлагает большой выбор автомобилей от ведущих производителей. Мы гарантируем качество и надежность.'
    },
    about: {
      title: 'О компании TMC Авто',
      content: 'TMC Авто - это компания с многолетним опытом работы на автомобильном рынке. Мы специализируемся на продаже автомобилей различных марок и моделей.'
    },
    contact: {
      address: 'г. Москва, ул. Автомобильная, д. 1',
      worktime: 'Пн-Пт: 9:00 - 20:00, Сб-Вс: 10:00 - 18:00'
    }
  }
};

type AdminContextType = {
  isAdmin: boolean;
  setAdmin: (isAdmin: boolean) => void;
  login: (password: string) => boolean;
  logout: () => void;
  cars: Car[];
  loading: boolean;
  deleteCar: (carId: string) => Promise<void>;
  siteConfig: SiteConfig;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;
};

const ADMIN_PASSWORD = "admin123"; // In a real app, use a more secure method
const ADMIN_STORAGE_KEY = "tmcavto_is_admin";
const SITE_CONFIG_KEY = "tmcavto_site_config";

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const globalCars = useGlobalCars();
  const { toast } = useToast();

  useEffect(() => {
    const storedAdminStatus = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (storedAdminStatus === 'true') {
      setIsAdmin(true);
    }
    
    const storedConfig = localStorage.getItem(SITE_CONFIG_KEY);
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
        setSiteConfig({...DEFAULT_CONFIG, ...parsedConfig});
      } catch (error) {
        console.error("Failed to parse site configuration:", error);
        setSiteConfig(DEFAULT_CONFIG);
      }
    }
  }, []);

  const setAdmin = (value: boolean) => {
    setIsAdmin(value);
    localStorage.setItem(ADMIN_STORAGE_KEY, value.toString());
  };

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  const updateSiteConfig = (config: Partial<SiteConfig>) => {
    const newConfig = {...siteConfig, ...config};
    setSiteConfig(newConfig);
    
    try {
      localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(newConfig));
      console.log("Site configuration saved", newConfig);
    } catch (error) {
      console.error("Failed to save site configuration:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить настройки сайта"
      });
    }
  };

  const deleteCar = async (carId: string) => {
    return globalCars.deleteCar(carId);
  };

  return (
    <AdminContext.Provider value={{ 
      isAdmin, 
      setAdmin, 
      login, 
      logout,
      cars: globalCars.cars,
      loading: globalCars.loading,
      deleteCar,
      siteConfig,
      updateSiteConfig
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
