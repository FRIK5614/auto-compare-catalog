
// Export all order API functions from this file
import { orderOperations } from './orderOperations';
import { orderQueries } from './orderQueries';
import { orderNotifications } from './orderNotifications';

// Re-export all functions as a single orderAPI object
export const orderAPI = {
  ...orderOperations,
  ...orderQueries,
  ...orderNotifications
};

// Export individual functions for backward compatibility
export const { submitPurchaseRequest, updateOrderStatus } = orderOperations;
export const { getAllOrders, getOrderById } = orderQueries;
