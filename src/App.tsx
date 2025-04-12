
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import CarDetails from "./pages/CarDetails";
import CompareCars from "./pages/CompareCars";
import Favorites from "./pages/Favorites";
import Catalog from "./pages/Catalog";
import BrandCatalog from "./pages/BrandCatalog";
import BodyTypeCatalog from "./pages/BodyTypeCatalog";
import HotOffers from "./pages/HotOffers";
import NotFound from "./pages/NotFound";
import TmcAvtoCatalog from "./components/TmcAvtoCatalog";
import { AdminProvider } from "./contexts/AdminContext";
import { CarsProvider } from "./contexts/CarsContext";
import { ChatProvider } from "./contexts/ChatContext";
import { useCars } from "@/hooks/useCars";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminImport from "./pages/AdminImport";
import AdminSettings from "./pages/AdminSettings";
import AdminCars from "./pages/AdminCars";
import AdminCarEdit from "./pages/AdminCarEdit";
import { supabase } from "./integrations/supabase/client";
import { initializeSupabase } from "./integrations/supabase/init";
import NetworkStatus from "./components/NetworkStatus";
import 'swiper/css';

// Создаем новый экземпляр query client с дефолтными опциями
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Инициализируем Supabase при загрузке
initializeSupabase().catch(error => {
  console.error("Failed to initialize Supabase:", error);
});

// AppContent компонент для обработки маршрутов
const AppContent = () => {
  const location = useLocation();

  // Создаем storage bucket для изображений автомобилей, если он не существует
  useEffect(() => {
    const setupStorage = async () => {
      try {
        // Check if the bucket exists (we can only do this indirectly)
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (!error && buckets) {
          const carImagesBucketExists = buckets.some(bucket => bucket.name === 'car-images');
          
          if (!carImagesBucketExists) {
            // Bucket doesn't exist, create it
            const { data, error: createError } = await supabase.storage.createBucket('car-images', {
              public: true, // Make it publicly accessible
              fileSizeLimit: 10485760, // 10MB limit
            });
            
            if (createError) {
              console.error('Error creating car-images bucket:', createError);
            } else {
              console.log('Created car-images bucket successfully');
            }
          }
        }
      } catch (err) {
        console.error('Error checking/creating storage bucket:', err);
      }
    };
    
    setupStorage();
  }, []);

  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/compare" element={<CompareCars />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/hot-offers" element={<HotOffers />} />
          
          {/* Маршруты админ-панели */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tmcavto-catalog" element={<TmcAvtoCatalog />} />
            <Route path="cars" element={<AdminCars />} />
            <Route path="cars/edit/:id" element={<AdminCarEdit />} />
            <Route path="cars/new" element={<AdminCarEdit />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="import" element={<AdminImport />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* Редирект со старого маршрута на админ-панель */}
          <Route path="/tmcavto-catalog" element={<AdminLogin />} />
          
          {/* Маршрут для всех несуществующих страниц */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Компонент для отображения статуса сети */}
        <NetworkStatus />
      </TooltipProvider>
    </>
  );
};

// Основной компонент App
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CarsProvider>
          <AdminProvider>
            <ChatProvider>
              <AppContent />
            </ChatProvider>
          </AdminProvider>
        </CarsProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
