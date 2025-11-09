import api from './api';

const userService = {
  // ============ PROFILE ============
  
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      
      // Update user in localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ ADDRESSES ============
  
  // Get all user addresses
  getAddresses: async () => {
    try {
      const response = await api.get('/users/addresses');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single address by ID
  getAddressById: async (addressId) => {
    try {
      const response = await api.get(`/users/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new address
  createAddress: async (addressData) => {
    try {
      const response = await api.post('/users/addresses', addressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/users/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete address
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/users/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    try {
      const response = await api.put(`/users/addresses/${addressId}/set-default`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ PRESCRIPTIONS ============
  
  // Get all user prescriptions
  getPrescriptions: async () => {
    try {
      const response = await api.get('/users/prescriptions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single prescription by ID
  getPrescriptionById: async (prescriptionId) => {
    try {
      const response = await api.get(`/users/prescriptions/${prescriptionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new prescription
  createPrescription: async (prescriptionData) => {
    try {
      const response = await api.post('/users/prescriptions', prescriptionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update prescription
  updatePrescription: async (prescriptionId, prescriptionData) => {
    try {
      const response = await api.put(`/users/prescriptions/${prescriptionId}`, prescriptionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete prescription
  deletePrescription: async (prescriptionId) => {
    try {
      const response = await api.delete(`/users/prescriptions/${prescriptionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload prescription file/image
  uploadPrescription: async (file, prescriptionData) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add other prescription data
      Object.keys(prescriptionData).forEach(key => {
        formData.append(key, prescriptionData[key]);
      });

      const response = await api.post('/users/prescriptions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ ORDER HISTORY ============
  
  // Get user's order history
  getOrderHistory: async () => {
    try {
      const response = await api.get('/users/orders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
