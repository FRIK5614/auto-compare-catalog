
import { supabase } from '@/integrations/supabase/client';

/**
 * Увеличение счетчика просмотров автомобиля в Supabase
 */
export const incrementCarViewCount = async (carId: string): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('view_count')
      .eq('id', carId)
      .single();
    
    if (error) {
      throw error;
    }
    
    const currentViewCount = data?.view_count || 0;
    
    const { error: updateError } = await supabase
      .from('vehicles')
      .update({ view_count: currentViewCount + 1 })
      .eq('id', carId);
    
    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error("Ошибка при обновлении счетчика просмотров:", error);
  }
};
