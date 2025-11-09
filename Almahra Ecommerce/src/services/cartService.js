import api from './api';

const cartService = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1, variantId = null) => {
    try {
      const response = await api.post('/cart/add', {
        product_id: productId,
        quantity,
        variant_id: variantId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/update/${itemId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get cart summary (total items, total price)
  getCartSummary: async () => {
    try {
      const response = await api.get('/cart');
      const cart = response.data;
      
      const totalItems = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      const totalPrice = cart.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
      
      return {
        totalItems,
        totalPrice,
        items: cart.items || [],
      };
    } catch (error) {
      throw error;
    }
  },

  // Sync local cart with server (useful after login)
  syncCart: async (localCartItems) => {
    try {
      // Add each local cart item to server cart
      for (const item of localCartItems) {
        await cartService.addToCart(item.product_id, item.quantity, item.variant_id);
      }
      
      // Get updated cart
      return await cartService.getCart();
    } catch (error) {
      throw error;
    }
  },
};

export default cartService;
