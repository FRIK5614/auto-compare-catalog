
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car } from '../types/car';
import { useCars as useGlobalCars } from './CarsContext';

type AdminContextType = {
  isAdmin: boolean;
  setAdmin: (isAdmin: boolean) => void;
  login: (password: string) => boolean;
  logout: () => void;
  cars: Car[];
  loading: boolean;
  deleteCar: (carId: string) => Promise<void>;
};

const ADMIN_PASSWORD = "admin123"; // In a real app, use a more secure method
const ADMIN_STORAGE_KEY = "tmcavto_is_admin";

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const globalCars = useGlobalCars();

  useEffect(() => {
    // Check localStorage for admin status on initial load
    const storedAdminStatus = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (storedAdminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const setAdmin = (value: boolean) => {
    setIsAdmin(value);
    // Store admin status in localStorage
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

  // Proxy methods from the global CarsContext for admin use
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
      deleteCar
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
