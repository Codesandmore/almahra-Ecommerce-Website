import api from './api';

const reviewService = {
  // Get reviews for a product
  getProductReviews: async (productId, params = {}) => {
    try {
      const response = await api.get(`/products/${productId}/reviews`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single review by ID
  getReviewById: async (reviewId) => {
    try {
      const response = await api.get(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new review
  createReview: async (productId, reviewData) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, {
        rating: reviewData.rating,
        comment: reviewData.comment,
        title: reviewData.title || '',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, {
        rating: reviewData.rating,
        comment: reviewData.comment,
        title: reviewData.title || '',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's reviews
  getUserReviews: async () => {
    try {
      const response = await api.get('/reviews/my-reviews');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if user has reviewed a product
  hasUserReviewed: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/reviews/check`);
      return response.data.hasReviewed || false;
    } catch (error) {
      return false;
    }
  },

  // Get product rating summary
  getProductRatingSummary: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/reviews/summary`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark review as helpful
  markHelpful: async (reviewId) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/helpful`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Report review
  reportReview: async (reviewId, reason) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/report`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default reviewService;
