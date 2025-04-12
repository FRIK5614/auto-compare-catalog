
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Car, FetchCatalogDataParams, TmcAvtoCatalogState } from './types';

export const useCatalogData = () => {
  const [state, setState] = useState<TmcAvtoCatalogState>({
    loading: false,
    error: null,
    cars: [],
    logs: [],
    blockedSources: []
  });

  const updateState = (newState: Partial<TmcAvtoCatalogState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  const addBlockedSource = (source: string) => {
    setState(prevState => ({
      ...prevState,
      blockedSources: prevState.blockedSources.includes(source) 
        ? prevState.blockedSources 
        : [...prevState.blockedSources, source]
    }));
  };

  const checkBlockedSource = (errorMessage: string, url: string) => {
    if (errorMessage.includes('блокирует') || 
        errorMessage.includes('запрещен') || 
        errorMessage.includes('Access Denied')) {
      
      if (url.includes('/china')) {
        addBlockedSource('china');
      } else if (url.includes('/japan')) {
        addBlockedSource('japan');
      } else if (url.includes('/korea')) {
        addBlockedSource('korea');
      }
      
      toast({
        title: 'Доступ заблокирован',
        description: 'Сайт блокирует парсинг данных. Попробуйте позже или используйте другой источник.',
        variant: 'destructive',
      });
    }
  };

  const fetchCatalogData = async ({ url }: FetchCatalogDataParams, onError?: (error: string) => void) => {
    updateState({ loading: true, error: null, logs: [] });

    try {
      console.log(`Отправка запроса к tmcavto-catalog с URL: ${url}`);
      
      const { data, error } = await supabase.functions.invoke('tmcavto-catalog', {
        body: { url },
      });

      console.log('Ответ от функции:', data, error);

      if (error) {
        const errorMessage = error.message || 'Ошибка при получении данных';
        console.error('Ошибка API:', errorMessage);
        updateState({ error: errorMessage });
        
        checkBlockedSource(errorMessage, url);
        
        toast({
          title: 'Ошибка',
          description: errorMessage,
          variant: 'destructive',
        });
        
        if (onError) onError(errorMessage);
        return null;
      }

      if (!data) {
        const errorMessage = 'Получен пустой ответ от сервера';
        console.error(errorMessage);
        updateState({ error: errorMessage });
        toast({
          title: 'Ошибка',
          description: errorMessage,
          variant: 'destructive',
        });
        if (onError) onError(errorMessage);
        return null;
      }

      // Сохраняем логи, если они есть
      if (data.logs && Array.isArray(data.logs)) {
        updateState({ logs: data.logs });
      }

      // Если ответ содержит данные об автомобилях
      if (data.data && Array.isArray(data.data)) {
        console.log(`Получено ${data.data.length} автомобилей`);
        updateState({ cars: data.data });
        
        if (data.data.length === 0) {
          toast({
            title: 'Данные получены',
            description: 'Не найдено автомобилей в этом разделе',
            variant: 'default',
          });
        } else {
          toast({
            title: 'Данные получены',
            description: `Получено ${data.data.length} автомобилей`,
            variant: 'default',
          });
        }
        
        return data.data;
      } else {
        console.log('Получены данные не в формате массива');
        toast({
          title: 'Внимание',
          description: 'Получены данные в неизвестном формате',
          variant: 'default',
        });
        return data.data;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Произошла неизвестная ошибка';
      console.error('Ошибка запроса:', errorMessage);
      updateState({ error: errorMessage });
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      });
      if (onError) onError(errorMessage);
      return null;
    } finally {
      updateState({ loading: false });
    }
  };

  return {
    ...state,
    fetchCatalogData,
    updateState,
    addBlockedSource
  };
};
