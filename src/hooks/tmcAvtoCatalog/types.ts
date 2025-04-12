
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  country: string;
  imageUrl: string;
  detailUrl: string;
}

export interface UseTmcAvtoCatalogProps {
  onError?: (error: string) => void;
}

export interface FetchCatalogDataParams {
  url: string;
}

export interface ImportCarsParams {
  onSuccess?: (data: any) => void;
}

export interface TmcAvtoCatalogState {
  loading: boolean;
  error: string | null;
  cars: Car[];
  logs: string[];
  blockedSources: string[];
}
