
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/car";
import { v4 as uuidv4 } from 'uuid';
import { transformOrder } from "@/services/api/transformers";

export const orderProvider = {
  async getOrders(): Promise<Order[]> {
    try {
      console.log('[API] Загрузка заказов из Supabase');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          vehicles:car_id (
            id,
            brand,
            model,
            image_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Ошибка при загрузке заказов:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('[API] В базе данных нет заказов');
        return [];
      }
      
      // Преобразуем данные из формата Supabase в формат Order
      const orders: Order[] = data.map(order => transformOrder(order));
      
      console.log(`[API] Получено ${orders.length} заказов из Supabase`);
      return orders;
    } catch (error) {
      console.error("Ошибка при получении данных о заказах:", error);
      throw new Error("Не удалось загрузить данные о заказах из базы данных");
    }
  },

  async createOrder(order: {
    carId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    message?: string;
  }): Promise<Order | null> {
    try {
      console.log(`[API] Создание нового заказа в Supabase:`, order);
      
      const newOrder = {
        id: uuidv4(),
        car_id: order.carId,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_email: order.customerEmail,
        status: 'new',
        message: order.message || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log("Отправка заказа:", newOrder);
      
      const { data, error } = await supabase
        .from('orders')
        .insert(newOrder)
        .select(`
          *,
          vehicles:car_id (
            id,
            brand,
            model,
            image_url
          )
        `)
        .single();
      
      if (error) {
        console.error('Ошибка при создании заказа:', error);
        throw error;
      }
      
      console.log('Заказ успешно создан:', data);
      
      return transformOrder(data);
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      throw new Error("Не удалось создать заказ в базе данных");
    }
  },

  async updateOrderStatus(
    orderId: string,
    status: 'new' | 'processing' | 'completed' | 'canceled'
  ): Promise<boolean> {
    try {
      console.log(`[API] Обновление статуса заказа ${orderId} на ${status}`);
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) {
        console.error('Ошибка при обновлении статуса заказа:', error);
        throw error;
      }
      
      console.log('Статус заказа успешно обновлен');
      return true;
    } catch (error) {
      console.error("Ошибка при обновлении статуса заказа:", error);
      return false;
    }
  }
};
