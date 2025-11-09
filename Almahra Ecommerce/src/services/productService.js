import api from './api';
import { transformProducts, transformProduct } from '../utils/dataTransform.js';

const productService = {
  // Get all products with filters and pagination
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return {
        ...response.data,
        products: transformProducts(response.data.products || [])
      };
    } catch (error) {
      throw error;
    }
  },

  // Get single product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return {
        ...response.data,
        product: transformProduct(response.data.product)
      };
    } catch (error) {
      throw error;
    }
  },

  // Search products
  searchProducts: async (query, filters = {}) => {
    try {
      const response = await api.get('/products', {
        params: {
          search: query,
          ...filters,
        },
      });
      return {
        ...response.data,
        products: transformProducts(response.data.products || [])
      };
    } catch (error) {
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    try {
      const response = await api.get('/products', {
        params: {
          category,
          ...params,
        },
      });
      return {
        ...response.data,
        products: transformProducts(response.data.products || [])
      };
    } catch (error) {
      throw error;
    }
  },

  // Get products by brand
  getProductsByBrand: async (brand, params = {}) => {
    try {
      const response = await api.get('/products', {
        params: {
          brand,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all brands
  getBrands: async () => {
    try {
      const response = await api.get('/products/brands');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Filter products with advanced options
  filterProducts: async (filters) => {
    try {
      // filters can include: category, brand, min_price, max_price, color, size, in_stock, sort_by, page, per_page
      const response = await api.get('/products', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get featured/popular products
  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/products', {
        params: {
          featured: true,
          per_page: 8,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get new arrivals
  getNewArrivals: async () => {
    try {
      const response = await api.get('/products', {
        params: {
          sort_by: 'newest',
          per_page: 8,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all products (alias for admin)
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return {
        ...response.data,
        products: transformProducts(response.data.products || [])
      };
    } catch (error) {
      throw error;
    }
  },

  // Create new product (Admin only)
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return {
        ...response.data,
        product: transformProduct(response.data.product)
      };
    } catch (error) {
      throw error;
    }
  },

  // Update product (Admin only)
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete product (Admin only)
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productService;
