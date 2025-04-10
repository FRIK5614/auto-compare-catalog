
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import CarDetails from "./pages/CarDetails";
import CompareCars from "./pages/CompareCars";
import Favorites from "./pages/Favorites";
import Catalog from "./pages/Catalog";
import NotFound from "./pages/NotFound";
import TmcAvtoCatalog from "./components/TmcAvtoCatalog";
import { AdminProvider } from "./contexts/AdminContext";
import { CarsProvider } from "./contexts/CarsContext";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminImport from "./pages/AdminImport";
import AdminChat from "./pages/AdminChat";
import AdminCars from "./pages/AdminCars";
import { supabase } from "./integrations/supabase/client";
import 'swiper/css';

// Create a new query client instance with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// AppContent component to handle routes
const AppContent = () => {
  const location = useLocation();

  // Create storage bucket for car images if it doesn't exist
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
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tmcavto-catalog" element={<TmcAvtoCatalog />} />
            <Route path="cars" element={<AdminCars />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="import" element={<AdminImport />} />
            <Route path="settings" element={<AdminDashboard />} />
            <Route path="chat" element={<AdminChat />} />
          </Route>
          
          {/* Redirect old route to admin panel */}
          <Route path="/tmcavto-catalog" element={<AdminLogin />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </>
  );
};

// Main App component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CarsProvider>
          <AdminProvider>
            <AppContent />
          </AdminProvider>
        </CarsProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
