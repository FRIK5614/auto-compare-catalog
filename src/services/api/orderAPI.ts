
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/car';

/**
 * Отправка заявки на покупку в Supabase
 */
export const submitPurchaseRequest = async (formData: Record<string, any>): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`[API] Отправка заявки на покупку в Supabase:`, formData);
    
    const order = {
      car_id: formData.carId,
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_email: formData.email,
      status: 'new'
    };
    
    console.log("[API] Отправляем данные заказа:", order);
    
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) {
      console.error("Ошибка при отправке заявки:", error);
      throw error;
    }
    
    console.log(`[API] Заявка успешно отправлена в Supabase:`, data);
    return {
      success: true,
      message: "Ваша заявка успешно отправлена. Наш менеджер свяжется с вами в ближайшее время."
    };
  } catch (error) {
    console.error("Ошибка при отправке заявки:", error);
    return {
      success: false,
      message: "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже."
    };
  }
};

/**
 * Получение заказов из Supabase
 */
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    console.log(`[API] Загрузка заказов из Supabase`);
    
    const { data, error } = await supabase
      .from('orders')
      .select('*, vehicles(brand, model, id, image_url)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Ошибка при получении заказов:", error);
      throw error;
    }
    
    console.log(`[API] Получено ${data?.length || 0} заказов из Supabase:`, data);
    
    // Transform the data to match our Order type
    const orders: Order[] = (data || []).map(order => ({
      id: order.id,
      carId: order.car_id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email,
      status: order.status,
      createdAt: order.created_at,
      // Add car details if available
      car: order.vehicles ? {
        id: order.vehicles.id,
        brand: order.vehicles.brand,
        model: order.vehicles.model,
        image_url: order.vehicles.image_url
      } : undefined
    }));
    
    return orders;
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    return [];
  }
};

/**
 * Обновление статуса заказа в Supabase
 */
export const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
  try {
    console.log(`[API] Обновление статуса заказа ${orderId} в Supabase на ${status}`);
    
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    
    if (error) {
      console.error("Ошибка при обновлении статуса заказа:", error);
      throw error;
    }
    
    console.log(`[API] Статус заказа успешно обновлен в Supabase`);
    return true;
  } catch (error) {
    console.error("Ошибка при обновлении статуса заказа:", error);
    return false;
  }
};
