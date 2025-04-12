
import { useState } from 'react';
import { useTmcAvtoCatalog } from '@/hooks/tmcAvtoCatalog';
import { useAdmin } from '@/contexts/AdminContext';
import { useLocation } from 'react-router-dom';
import { CatalogCard } from './CatalogCard';
import { ImportPanel } from './ImportPanel';
import { CarTabs } from './CarTabs';
import { AlertsPanel } from './AlertsPanel';

const TmcAvtoCatalog = () => {
  const [url, setUrl] = useState('/cars/japan');
  const [responseData, setResponseData] = useState<string | null>(null);
  const { fetchCatalogData, importAllCars, loading, error, cars, logs, blockedSources } = useTmcAvtoCatalog();
  const [activeTab, setActiveTab] = useState('catalog');
  const [showLogs, setShowLogs] = useState(false);
  const { isAdmin } = useAdmin();
  const location = useLocation();
  
  const isAdminPage = location.pathname.includes('/admin');
  const showImportTab = isAdmin && isAdminPage;

  const handleFetch = async () => {
    const data = await fetchCatalogData({ url });
    if (data) {
      setResponseData(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    }
  };

  const handleImport = async () => {
    setShowLogs(true);
    await importAllCars();
  };

  const getCountryFilter = (country: string) => {
    return cars.filter(car => car.country === country);
  };

  const japanCars = getCountryFilter('Япония');
  const koreaCars = getCountryFilter('Корея');
  const chinaCars = getCountryFilter('Китай');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <CatalogCard
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showImportTab={showImportTab}
        blockedSources={blockedSources}
      >
        {activeTab === 'catalog' ? (
          <>
            {cars.length > 0 ? (
              <CarTabs 
                cars={cars}
                japanCars={japanCars}
                koreaCars={koreaCars}
                chinaCars={chinaCars}
                blockedSources={blockedSources}
                loading={loading}
                handleImport={handleImport}
                showImportTab={showImportTab}
              />
            ) : (
              <EmptyCatalog 
                loading={loading} 
                handleImport={handleImport} 
                showImportTab={showImportTab} 
              />
            )}
          </>
        ) : (
          <ImportPanel
            url={url}
            setUrl={setUrl}
            handleFetch={handleFetch}
            handleImport={handleImport}
            loading={loading}
            showLogs={showLogs}
            setShowLogs={setShowLogs}
            logs={logs}
            responseData={responseData}
            error={error}
            cars={cars}
            blockedSources={blockedSources}
          />
        )}
      </CatalogCard>
    </div>
  );
};

export default TmcAvtoCatalog;
