
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTmcAvtoCatalog } from '@/hooks/useTmcAvtoCatalog';
import { Car } from '@/types/car';
import { createCarFromImportData } from '../utils/carUrlFetcher';

export const useExternalCarData = (setCar: React.Dispatch<React.SetStateAction<Car | null>>, setImages: React.Dispatch<React.SetStateAction<{ id: string, url: string, alt: string }[]>>) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { fetchCatalogData } = useTmcAvtoCatalog();

  // Handle car data from URL
  const fetchCarFromUrl = async (url: string) => {
    setLoading(true);
    
    try {
      const result = await fetchCatalogData({ url });
      
      if (result && result.length > 0) {
        const importedCar = result[0];
        const newCar = createCarFromImportData(importedCar);
        
        setCar(newCar);
        if (newCar.images) {
          setImages(newCar.images);
        }
        
        toast({
          title: "Данные получены",
          description: `Импортированы данные для ${newCar.brand} ${newCar.model}`,
        });
        
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка импорта",
          description: "Не удалось получить данные об автомобиле по указанному URL",
        });
        return false;
      }
    } catch (error) {
      console.error("Error fetching car data:", error);
      toast({
        variant: "destructive",
        title: "Ошибка импорта",
        description: "Произошла ошибка при получении данных. Проверьте URL и попробуйте снова.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchCarFromUrl
  };
};
