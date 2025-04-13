
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { CarsProvider } from "@/contexts/cars/CarsProvider";
import { AdminProvider } from "@/contexts/AdminContext";
import { ChatProvider } from "@/contexts/ChatContext";

// Pages
import Index from "@/pages/Index";
import Catalog from "@/pages/Catalog";
import CarDetails from "@/pages/CarDetails";
import HotOffers from "@/pages/HotOffers";
import BodyTypeCatalog from "@/pages/BodyTypeCatalog";
import BrandCatalog from "@/pages/BrandCatalog";
import CompareCars from "@/pages/CompareCars";
import Favorites from "@/pages/Favorites";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminCars from "@/pages/AdminCars";
import AdminCarEdit from "@/pages/AdminCarEdit";
import AdminLogin from "@/pages/AdminLogin";
import AdminImport from "@/pages/AdminImport";
import AdminOrders from "@/pages/AdminOrders";
import AdminSettings from "@/pages/AdminSettings";
import AdminChat from "@/pages/AdminChat";
import NotFound from "@/pages/NotFound";
import AdminLayout from "@/components/AdminLayout";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <HelmetProvider>
          <CarsProvider>
            <AdminProvider>
              <ChatProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/cars" element={<Catalog />} />
                  <Route path="/cars/:brand/:model/:id" element={<CarDetails />} />
                  <Route path="/car/:id" element={<CarDetails />} /> {/* Added direct car ID route */}
                  <Route path="/cars/type/:bodyType" element={<BodyTypeCatalog />} />
                  <Route path="/cars/brand/:brand" element={<BrandCatalog />} />
                  <Route path="/special-offers" element={<HotOffers />} />
                  <Route path="/compare" element={<CompareCars />} />
                  <Route path="/favorites" element={<Favorites />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/cars" element={<AdminLayout><AdminCars /></AdminLayout>} />
                  <Route path="/admin/cars/new" element={<AdminLayout><AdminCarEdit /></AdminLayout>} />
                  <Route path="/admin/cars/edit/:id" element={<AdminLayout><AdminCarEdit /></AdminLayout>} />
                  <Route path="/admin/import" element={<AdminLayout><AdminImport /></AdminLayout>} />
                  <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
                  <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
                  <Route path="/admin/chat" element={<AdminLayout><AdminChat /></AdminLayout>} />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ChatProvider>
            </AdminProvider>
          </CarsProvider>
        </HelmetProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
