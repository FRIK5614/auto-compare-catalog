
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
  
  // Улучшенная функция для получения min и max цен
  const getPriceRange = () => {
    if (cars.length === 0) return { min: 0, max: 10000000 };
    
    const actualPrices = cars.map(car => 
      car.price.discount ? car.price.base - car.price.discount : car.price.base
    );
    
    return {
      min: Math.min(...actualPrices),
      max: Math.max(...actualPrices)
    };
  };
  
  // Улучшенная функция для получения min и max годов
  const getYearRange = () => {
    if (cars.length === 0) return { min: 1990, max: new Date().getFullYear() };
    
    const years = cars.map(car => car.year);
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    };
  };
  
  // Улучшенная функция сортировки
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
  
  // Новая функция для расширенного фильтра с дополнительными параметрами
  const applyAdvancedFilter = (carsToFilter: Car[], advancedFilter: CarFilter) => {
    if (!carsToFilter || carsToFilter.length === 0) return [];
    
    let result = [...carsToFilter];
    
    // Фильтр по брендам
    if (advancedFilter.brands && advancedFilter.brands.length > 0) {
      result = result.filter(car => advancedFilter.brands?.includes(car.brand));
    }
    
    // Фильтр по моделям
    if (advancedFilter.models && advancedFilter.models.length > 0) {
      result = result.filter(car => advancedFilter.models?.includes(car.model));
    }
    
    // Фильтр по годам
    if (advancedFilter.years && advancedFilter.years.length > 0) {
      result = result.filter(car => advancedFilter.years?.includes(car.year));
    }
    
    // Диапазон цен, учитывая скидки
    if (advancedFilter.priceRange) {
      result = result.filter(car => {
        const actualPrice = car.price.discount 
          ? car.price.base - car.price.discount 
          : car.price.base;
          
        return actualPrice >= (advancedFilter.priceRange?.min || 0) && 
               actualPrice <= (advancedFilter.priceRange?.max || Infinity);
      });
    }
    
    // Тип кузова
    if (advancedFilter.bodyTypes && advancedFilter.bodyTypes.length > 0) {
      result = result.filter(car => advancedFilter.bodyTypes?.includes(car.bodyType));
    }
    
    // Тип двигателя
    if (advancedFilter.engineTypes && advancedFilter.engineTypes.length > 0) {
      result = result.filter(car => advancedFilter.engineTypes?.includes(car.engine.type));
    }
    
    // Тип привода
    if (advancedFilter.drivetrains && advancedFilter.drivetrains.length > 0) {
      result = result.filter(car => advancedFilter.drivetrains?.includes(car.drivetrain));
    }
    
    // Новый/с пробегом
    if (advancedFilter.isNew !== undefined) {
      result = result.filter(car => car.isNew === advancedFilter.isNew);
    }
    
    // Страна производитель
    if (advancedFilter.countries && advancedFilter.countries.length > 0) {
      result = result.filter(car => car.country && advancedFilter.countries?.includes(car.country));
    }
    
    // КПП (исправляем ошибку с transmissionTypes -> transmissionType)
    if (advancedFilter.transmissionType && advancedFilter.transmissionType.length > 0) {
      result = result.filter(car => 
        advancedFilter.transmissionType?.includes(car.transmission.type)
      );
    }
    
    // Наличие скидки (добавляем проверку на discount > 0)
    if (advancedFilter.discount === true) {
      result = result.filter(car => car.price.discount && car.price.discount > 0);
    }
    
    return result;
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
    applyAdvancedFilter,
    // Экспортируем эти функции для исправления ошибок сборки
    addToFavorites,
    removeFromFavorites,
    addToCompare,
    removeFromCompare
  };
};
