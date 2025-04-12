
import { useCarsData } from "./useCarsData";
import { useFilters } from "./useFilters";
import { useCompare } from "./useCompare";
import { useFavorites } from "./favorites";
import { useOrders } from "./orders";
import { useCarsCRUD } from "./useCarsCRUD";

export const useInitializeHooks = () => {
  // Initialize car data and state
  const { cars, loading, error, reloadCars, isOnline } = useCarsData();
  
  // Initialize filtering
  const { filteredCars, filter, setFilter } = useFilters(cars);
  
  // Initialize favorites
  const { favorites, addToFavorites, removeFromFavorites, refreshFavorites } = useFavorites();
  
  // Initialize comparison
  const { compareCars, addToCompare, removeFromCompare, clearCompare } = useCompare();
  
  // Initialize orders
  const { orders, processOrder, getOrders, reloadOrders } = useOrders();
  
  // Initialize CRUD operations
  const { getCarById, viewCar, deleteCar, updateCar, addCar, uploadCarImage, exportCarsData, importCarsData } = useCarsCRUD(cars, reloadCars);
  
  return {
    cars,
    filteredCars,
    favorites,
    compareCars,
    orders,
    loading,
    error,
    isOnline,
    filter,
    setFilter,
    addToFavorites,
    removeFromFavorites,
    refreshFavorites,
    addToCompare,
    removeFromCompare,
    clearCompare,
    getCarById,
    reloadCars,
    viewCar,
    deleteCar,
    updateCar,
    addCar,
    uploadCarImage,
    processOrder,
    getOrders,
    reloadOrders,
    exportCarsData,
    importCarsData
  };
};
