
// This file serves as a proxy to maintain backwards compatibility
// It re-exports everything from the new refactored module
import { useTmcAvtoCatalog } from './tmcAvtoCatalog';
export type { Car, UseTmcAvtoCatalogProps, FetchCatalogDataParams, ImportCarsParams } from './tmcAvtoCatalog';
export { useTmcAvtoCatalog };
