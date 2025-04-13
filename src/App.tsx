
import { HelmetProvider } from "react-helmet-async";

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
