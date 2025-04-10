
import { useCars as useGlobalCars } from "../contexts/CarsContext";
import { Car, Order, CarFilter } from "../types/car";
import { useEffect, useState } from "react";

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

  // Оптимизируем загрузку, применяя ограничение
  useEffect(() => {
    if (filter && !filter.limit && window.location.pathname === '/') {
      setFilter({
        ...filter,
        limit: 24 // Ограничиваем количество автомобилей на главной странице
      });
    }
  }, [filter, setFilter]);

  const favoriteCars = cars.filter(car => favorites.includes(car.id));
  
  const comparisonCars: Car[] = compareCars
    .map(id => cars.find(car => car.id === id))
    .filter((car): car is Car => car !== undefined);

  const toggleFavorite = (carId: string) => {
    if (favorites.includes(carId)) {
      removeFromFavorites(carId);
    } else {
      addToFavorites(carId);
    }
  };

  const toggleCompare = (carId: string) => {
    if (compareCars.includes(carId)) {
      removeFromCompare(carId);
    } else {
      addToCompare(carId);
    }
  };

  const isFavorite = (carId: string) => favorites.includes(carId);
  
  const isInCompare = (carId: string) => compareCars.includes(carId);
  
  // Получаем самые просматриваемые автомобили
  const getMostViewedCars = (limit = 5): Car[] => {
    return [...cars]
      .filter(car => car.viewCount && car.viewCount > 0)
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit);
  };
  
  // Получаем уникальные значения для фильтров
  const getUniqueValues = <T extends keyof Car>(field: T): Car[T][] => {
    const values = cars.map(car => car[field]);
    return [...new Set(values)].filter(Boolean) as Car[T][];
  };
  
  // Получаем минимальные и максимальные значения для числовых фильтров
  const getPriceRange = () => {
    const prices = cars.map(car => car.price.base);
    return {
      min: Math.min(...prices) || 0,
      max: Math.max(...prices) || 10000000
    };
  };
  
  const getYearRange = () => {
    const years = cars.map(car => car.year);
    return {
      min: Math.min(...years) || 1990,
      max: Math.max(...years) || new Date().getFullYear()
    };
  };
  
  // Функция для применения сортировки
  const applySorting = (carsToSort: Car[], sortBy?: string): Car[] => {
    if (!carsToSort || carsToSort.length === 0) return [];
    
    const carsCopy = [...carsToSort];
    
    switch (sortBy) {
      case "priceAsc":
        return carsCopy.sort((a, b) => {
          const priceA = a.price.discount ? a.price.base - a.price.discount : a.price.base;
          const priceB = b.price.discount ? b.price.base - b.price.discount : b.price.base;
          return priceA - priceB;
        });
      case "priceDesc":
        return carsCopy.sort((a, b) => {
          const priceA = a.price.discount ? a.price.base - a.price.discount : a.price.base;
          const priceB = b.price.discount ? b.price.base - b.price.discount : b.price.base;
          return priceB - priceA;
        });
      case "yearDesc":
        return carsCopy.sort((a, b) => b.year - a.year);
      case "yearAsc":
        return carsCopy.sort((a, b) => a.year - b.year);
      case "nameAsc":
        return carsCopy.sort((a, b) => (a.brand + a.model).localeCompare(b.brand + b.model));
      case "nameDesc":
        return carsCopy.sort((a, b) => (b.brand + b.model).localeCompare(a.brand + a.model));
      case "popularity":
      default:
        return carsCopy.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    }
  };
  
  // Применяем сортировку к отфильтрованным автомобилям
  const sortedFilteredCars = applySorting(filteredCars, filter.sortBy);
  
  return {
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
    toggleFavorite,
    toggleCompare,
    clearCompare,
    isFavorite,
    isInCompare,
    getCarById,
    reloadCars,
    viewCar,
    deleteCar,
    updateCar,
    addCar,
    processOrder,
    getOrders,
    getMostViewedCars,
    getUniqueValues,
    getPriceRange,
    getYearRange,
    exportCarsData,
    importCarsData,
    uploadCarImage,
    applySorting,
    // Экспортируем эти функции для исправления ошибок сборки
    addToFavorites,
    removeFromFavorites,
    addToCompare,
    removeFromCompare
  };
};
