import api from './api';

const orderService = {
  // Create new order from cart (Cash on Delivery)
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', {
        shipping_address_id: orderData.shippingAddressId,
        billing_address_id: orderData.billingAddressId || orderData.shippingAddressId,
        payment_method: 'cash_on_delivery',
        notes: orderData.notes || '',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all user orders
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Track order
  trackOrder: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/track`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order history with filters
  getOrderHistory: async (filters = {}) => {
    try {
      const response = await api.get('/orders', {
        params: {
          ...filters,
          sort_by: 'created_at',
          order: 'desc',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by status
  getOrdersByStatus: async (status) => {
    try {
      const response = await api.get('/orders', {
        params: { status },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get recent orders
  getRecentOrders: async (limit = 5) => {
    try {
      const response = await api.get('/orders', {
        params: {
          per_page: limit,
          sort_by: 'created_at',
          order: 'desc',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default orderService;
