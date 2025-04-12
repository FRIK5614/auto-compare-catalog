
import { useCatalogData } from './useCatalogData';
import { useImportCars } from './useImportCars';
import { UseTmcAvtoCatalogProps, FetchCatalogDataParams, ImportCarsParams, Car } from './types';

export const useTmcAvtoCatalog = ({ onError }: UseTmcAvtoCatalogProps = {}) => {
  const { 
    loading, 
    error, 
    cars, 
    logs, 
    blockedSources, 
    fetchCatalogData: fetchData, 
    updateState,
    addBlockedSource
  } = useCatalogData();
  
  const { importAllCars } = useImportCars(updateState, addBlockedSource);

  // Wrapper function to maintain the same API
  const fetchCatalogData = async (params: FetchCatalogDataParams) => {
    return fetchData(params, onError);
  };

  return {
    fetchCatalogData,
    importAllCars,
    loading,
    error,
    cars,
    logs,
    blockedSources
  };
};

// Re-export types for consumers
export type { Car, UseTmcAvtoCatalogProps, FetchCatalogDataParams, ImportCarsParams };
