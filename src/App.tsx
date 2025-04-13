
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { CarsProvider } from "@/contexts/cars/CarsProvider";
import { AdminProvider } from "@/contexts/AdminContext";
import { ChatProvider } from "@/contexts/ChatContext";

// Create a client
const queryClient = new QueryClient();

// Main app content component
const AppContent = () => {
  return (
    <div className="app-container">
      {/* Your main app routes and content will go here */}
      <div id="app-content"></div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <HelmetProvider>
          <CarsProvider>
            <AdminProvider>
              <ChatProvider>
                <AppContent />
              </ChatProvider>
            </AdminProvider>
          </CarsProvider>
        </HelmetProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
