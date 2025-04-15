
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/car';
import { transformOrder } from '../transformers';

/**
 * API functions for retrieving order data
 */
export const orderQueries = {
  /**
   * Retrieve all orders from the database
   */
  async getAllOrders(): Promise<Order[]> {
    try {
      console.log('[API] Getting all orders');
      
      // Query the orders table with a join to vehicles to get car details
      const { data: orders, error } = await supabase
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
        console.error('Error fetching orders:', error);
        throw new Error(error.message);
      }
      
      console.log('Raw orders data:', orders);
      
      // Transform data to match Order type
      const transformedOrders: Order[] = orders?.map(order => transformOrder(order)) || [];
      console.log(`Retrieved ${transformedOrders.length} orders:`, transformedOrders);
      
      return transformedOrders;
    } catch (error) {
      console.error('Error in getAllOrders:', error);
      // Return empty array instead of throwing to avoid breaking the UI
      return [];
    }
  },
  
  /**
   * Get a specific order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      console.log(`[API] Getting order with ID: ${orderId}`);
      
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
        .eq('id', orderId)
        .single();
      
      if (error) {
        console.error('Error fetching order:', error);
        return null;
      }
      
      if (!data) {
        console.log('Order not found');
        return null;
      }
      
      return transformOrder(data);
    } catch (error) {
      console.error('Error in getOrderById:', error);
      return null;
    }
  }
};
