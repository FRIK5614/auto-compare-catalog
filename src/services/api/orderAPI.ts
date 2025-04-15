
// This file exists for backward compatibility
// All new code should import from 'src/services/api/order' instead
import { orderAPI, getAllOrders, getOrderById, submitPurchaseRequest, updateOrderStatus } from './order';

// Re-export the orderAPI object
export { orderAPI };

// Re-export individual functions for backward compatibility
export { getAllOrders, getOrderById, submitPurchaseRequest, updateOrderStatus };

// Alias for getAllOrders with original name
export const fetchOrders = getAllOrders;
