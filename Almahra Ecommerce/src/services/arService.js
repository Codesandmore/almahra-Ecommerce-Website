import api from './api';

const arService = {
  // Upload user photo for AR try-on
  uploadPhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await api.post('/ar/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Virtual try-on with product
  tryOn: async (productId, photoId) => {
    try {
      const response = await api.post(`/ar/try-on/${productId}`, {
        photo_id: photoId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Virtual try-on with uploaded photo (single request)
  tryOnWithPhoto: async (productId, photoFile) => {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('product_id', productId);

      const response = await api.post(`/ar/try-on/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get AR try-on result
  getResult: async (sessionId) => {
    try {
      const response = await api.get(`/ar/results/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's AR try-on history
  getHistory: async () => {
    try {
      const response = await api.get('/ar/history');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete AR try-on session
  deleteSession: async (sessionId) => {
    try {
      const response = await api.delete(`/ar/session/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Save AR try-on result
  saveResult: async (sessionId) => {
    try {
      const response = await api.post(`/ar/results/${sessionId}/save`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Share AR try-on result
  shareResult: async (sessionId) => {
    try {
      const response = await api.post(`/ar/results/${sessionId}/share`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if product supports AR try-on
  isProductSupported: async (productId) => {
    try {
      const response = await api.get(`/ar/product/${productId}/supported`);
      return response.data.supported || false;
    } catch (error) {
      return false;
    }
  },

  // Validate photo for AR try-on
  validatePhoto: (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPG, JPEG, and PNG files are allowed' };
    }

    return { valid: true };
  },
};

export default arService;
