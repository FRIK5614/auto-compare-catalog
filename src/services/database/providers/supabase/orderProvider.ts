
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/car";
import { transformOrder } from "@/services/api/transformers";

export const orderProvider = {
  async getOrders(): Promise<Order[]> {
    try {
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
        throw error;
      }
      
      // Transform data to match Order type
      const transformedOrders: Order[] = data?.map(order => transformOrder(order)) || [];
      
      return transformedOrders;
    } catch (error) {
      console.error("Error getting orders:", error);
      return [];
    }
  },
  
  async submitPurchaseRequest(formData: Record<string, any>): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          car_id: formData.carId,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          message: formData.message,
          status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        message: "Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время."
      };
    } catch (error) {
      console.error("Error submitting purchase request:", error);
      return {
        success: false,
        message: "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз."
      };
    }
  },
  
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      return false;
    }
  }
};
