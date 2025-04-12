
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ImportCarsParams } from './types';

export const useImportCars = (
  updateState: (state: any) => void, 
  addBlockedSource: (source: string) => void
) => {
  const checkLogsForBlockedSources = (logs: string[]) => {
    logs.forEach((log: string) => {
      if ((log.includes('Ошибка при импорте из Китай') || log.includes('блокирует') && log.includes('Китай'))) {
        addBlockedSource('china');
      }
      if ((log.includes('Ошибка при импорте из Япония') || log.includes('блокирует') && log.includes('Япония'))) {
        addBlockedSource('japan');
      }
      if ((log.includes('Ошибка при импорте из Корея') || log.includes('блокирует') && log.includes('Корея'))) {
        addBlockedSource('korea');
      }
    });
  };

  const importAllCars = async ({ onSuccess }: ImportCarsParams = {}, onError?: (error: string) => void) => {
    updateState({ loading: true, error: null, logs: [] });

    try {
      console.log('Начинаем импорт всех автомобилей...');
      
      toast({
        title: 'Импорт запущен',
        description: 'Начинаем импорт автомобилей. Это может занять некоторое время.',
      });
      
      const { data, error } = await supabase.functions.invoke('tmcavto-catalog', {
        body: { action: 'import' },
      });

      console.log('Ответ от функции импорта:', data, error);

      if (error) {
        const errorMessage = error.message || 'Ошибка при импорте данных';
        console.error('Ошибка API:', errorMessage);
        updateState({ error: errorMessage });
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

      // Обработка логов если они есть
      if (data.logs && Array.isArray(data.logs)) {
        updateState({ logs: data.logs });
        
        // Проверяем логи на наличие заблокированных источников
        checkLogsForBlockedSources(data.logs);
      }

      // Проверяем, что данные содержат массив автомобилей
      if (data.data && Array.isArray(data.data)) {
        console.log(`Импортировано ${data.data.length} автомобилей`);
        updateState({ cars: data.data });
        
        if (data.data.length === 0) {
          toast({
            title: 'Импорт завершен',
            description: 'Не удалось импортировать автомобили. Проверьте логи для получения дополнительной информации.',
            variant: 'default',
          });
        } else {
          toast({
            title: 'Импорт завершен',
            description: `Импортировано ${data.total || data.data.length} автомобилей`,
          });
        }

        if (onSuccess) {
          onSuccess(data.data);
        }

        return data.data;
      } else {
        const errorMessage = 'Данные не содержат список автомобилей';
        console.error(errorMessage, data);
        updateState({ error: errorMessage });
        toast({
          title: 'Ошибка',
          description: errorMessage,
          variant: 'destructive',
        });
        if (onError) onError(errorMessage);
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Произошла неизвестная ошибка';
      console.error('Ошибка импорта:', errorMessage);
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
    importAllCars
  };
};
