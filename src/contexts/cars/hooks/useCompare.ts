
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { addToCompare as addToCompareAction, removeFromCompare as removeFromCompareAction, clearCompare as clearCompareAction } from "../compareActions";
import { saveCompareToLocalStorage, loadCompareFromLocalStorage } from "../utils";

export const useCompare = () => {
  const [compareCars, setCompareCars] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  // Следим за состоянием сети
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Инициализация из localStorage при загрузке
  useEffect(() => {
    try {
      const compareData = loadCompareFromLocalStorage();
      // Применяем жесткий лимит в 3 машины для предотвращения проблем с производительностью
      const limitedCompareData = compareData.slice(0, 3);
      
      // Если пришлось ограничить данные, сохраняем ограниченную версию обратно в localStorage
      if (limitedCompareData.length < compareData.length) {
        saveCompareToLocalStorage(limitedCompareData);
        console.log(`Ограничили сравниваемые автомобили с ${compareData.length} до ${limitedCompareData.length}`);
        
        toast({
          title: "Ограничение сравнения",
          description: "Можно сравнивать не более 3 автомобилей одновременно. Список был сокращен."
        });
      }
      
      setCompareCars(limitedCompareData);
    } catch (error) {
      console.error("Ошибка при загрузке списка сравнения:", error);
      // В случае ошибки просто начинаем с пустого списка
      setCompareCars([]);
    }
  }, [toast]);

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    try {
      saveCompareToLocalStorage(compareCars);
      // Для сравнения мы не используем базу данных, так как это временные данные сессии
    } catch (error) {
      console.error("Ошибка при сохранении списка сравнения:", error);
    }
  }, [compareCars]);

  // Обработка добавления в сравнение
  const handleAddToCompare = useCallback((carId: string) => {
    if (compareCars.includes(carId)) {
      // Уже в списке сравнения
      return null;
    }
    
    if (compareCars.length >= 3) {
      // Достигнут лимит сравнения
      toast({
        variant: "destructive",
        title: "Ограничение сравнения",
        description: "Можно сравнивать не более 3 автомобилей одновременно"
      });
      return null;
    }
    
    // Добавляем в список сравнения
    const newCompareCars = [...compareCars, carId];
    setCompareCars(newCompareCars);
    saveCompareToLocalStorage(newCompareCars);
    
    toast({
      title: "Добавлено к сравнению",
      description: "Автомобиль добавлен к сравнению"
    });
    
    return true;
  }, [compareCars, toast]);

  // Обработка удаления из сравнения
  const handleRemoveFromCompare = useCallback((carId: string) => {
    const newCompareCars = compareCars.filter(id => id !== carId);
    setCompareCars(newCompareCars);
    saveCompareToLocalStorage(newCompareCars);
    
    toast({
      title: "Удалено из сравнения",
      description: "Автомобиль удален из списка сравнения"
    });
    
    return true;
  }, [compareCars, toast]);

  // Очистка всего списка сравнения
  const handleClearCompare = useCallback(() => {
    setCompareCars([]);
    saveCompareToLocalStorage([]);
    
    toast({
      title: "Список сравнения очищен",
      description: "Все автомобили удалены из списка сравнения"
    });
    
    return true;
  }, [toast]);
  
  // Проверка, находится ли автомобиль в списке сравнения
  const isInCompare = useCallback((carId: string) => {
    return compareCars.includes(carId);
  }, [compareCars]);

  return {
    compareCars,
    setCompareCars,
    isOnline,
    addToCompare: handleAddToCompare,
    removeFromCompare: handleRemoveFromCompare,
    clearCompare: handleClearCompare,
    isInCompare
  };
};
