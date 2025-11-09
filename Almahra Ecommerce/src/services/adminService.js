import api from './api';
import { transformProducts, transformProduct, transformUser, transformOrder } from '../utils/dataTransform.js';

const adminService = {
  // ============ DASHBOARD ============
  
  // Get dashboard analytics
  getDashboard: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get sales analytics
  getSalesAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/admin/analytics', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ ORDER MANAGEMENT ============
  
  // Get all orders (admin view)
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get('/admin/orders', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order details (admin view)
  getOrderDetails: async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ PRODUCT MANAGEMENT ============
  
  // Get all products (admin view)
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get('/admin/products', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await api.post('/admin/products', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/admin/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update product stock
  updateStock: async (productId, quantity) => {
    try {
      const response = await api.put(`/admin/products/${productId}/stock`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ USER MANAGEMENT ============
  
  // Get all users
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return {
        ...response.data,
        users: response.data.users?.map(transformUser) || []
      };
    } catch (error) {
      throw error;
    }
  },

  // Get user details
  getUserDetails: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return {
        ...response.data,
        user: transformUser(response.data.user)
      };
    } catch (error) {
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, {
        role,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Deactivate user
  deactivateUser: async (userId) => {
    try {
      const response = await api.put(`/admin/users/${userId}/deactivate`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Activate user
  activateUser: async (userId) => {
    try {
      const response = await api.put(`/admin/users/${userId}/activate`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ REPORTS ============
  
  // Generate sales report
  generateSalesReport: async (startDate, endDate) => {
    try {
      const response = await api.get('/admin/reports/sales', {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generate inventory report
  generateInventoryReport: async () => {
    try {
      const response = await api.get('/admin/reports/inventory');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get low stock products
  getLowStockProducts: async (threshold = 10) => {
    try {
      const response = await api.get('/admin/products/low-stock', {
        params: { threshold },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default adminService;
