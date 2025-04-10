
import { useCars as useGlobalCars } from "../contexts/CarsContext";
import { Car, CarFilter } from "../types/car";
import { useEffect } from "react";
import { useCarFilters } from "./useCarFilters";
import { useCarActions } from "./useCarActions";

export const useCars = () => {
  const {
    cars,
    filteredCars,
    favorites,
    compareCars,
    orders,
    loading,
    error,
    filter,
    setFilter,
    addToFavorites,
    removeFromFavorites,
    addToCompare,
    removeFromCompare,
    clearCompare,
    getCarById,
    reloadCars,
    viewCar,
    deleteCar,
    updateCar,
    addCar,
    processOrder,
    getOrders,
    exportCarsData,
    importCarsData,
    uploadCarImage
  } = useGlobalCars();

  // Инициализация фильтров для домашней страницы
  useEffect(() => {
    if (filter && !filter.limit && window.location.pathname === '/') {
      setFilter({
        ...filter,
        limit: 24
      });
    }
  }, [filter, setFilter]);

  // Получение вспомогательных хуков
  const filterUtils = useCarFilters(cars);
  const actionUtils = useCarActions(cars, favorites, compareCars);

  // Создание списка избранных и сравниваемых автомобилей
  const favoriteCars = cars.filter(car => favorites.includes(car.id));
  const comparisonCars = compareCars
    .map(id => cars.find(car => car.id === id))
    .filter((car): car is Car => car !== undefined);

  // Сортировка отфильтрованных автомобилей
  const sortedFilteredCars = filterUtils.applySorting(filteredCars, filter.sortBy);

  return {
    // Основные данные
    cars,
    filteredCars: sortedFilteredCars,
    favoriteCars,
    comparisonCars,
    compareCarsIds: compareCars,
    orders,
    loading,
    error,
    filter,
    setFilter,
    
    // Действия из useCarActions
    toggleFavorite: actionUtils.toggleFavorite,
    toggleCompare: actionUtils.toggleCompare,
    isFavorite: actionUtils.isFavorite,
    isInCompare: actionUtils.isInCompare,
    
    // Базовые действия из CarsContext
    clearCompare,
    getCarById,
    reloadCars,
    viewCar,
    deleteCar,
    updateCar,
    addCar,
    processOrder,
    getOrders,
    
    // Утилиты для фильтрации
    getMostViewedCars: filterUtils.getMostViewedCars,
    getUniqueValues: filterUtils.getUniqueValues,
    getPriceRange: filterUtils.getPriceRange,
    getYearRange: filterUtils.getYearRange,
    applySorting: filterUtils.applySorting,
    applyAdvancedFilter: filterUtils.applyAdvancedFilter,
    
    // Экспорт/импорт и загрузка
    exportCarsData,
    importCarsData,
    uploadCarImage,
    
    // Прямые методы работы с избранным и сравнением
    addToFavorites,
    removeFromFavorites,
    addToCompare,
    removeFromCompare
  };
};
