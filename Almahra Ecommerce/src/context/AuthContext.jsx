import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

const AuthContext = createContext();

// Helper function to convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  }
  
  const camelObj = {};
  Object.keys(obj).forEach(key => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    camelObj[camelKey] = toCamelCase(obj[key]);
  });
  
  return camelObj;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from token on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = authService.getCurrentUser();
          // Convert snake_case to camelCase
          setUser(toCamelCase(userData));
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const register = async (userData) => {
    try {
      // Transform form data to match API requirements
      const apiData = {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone || ''
      };

      const response = await authService.register(apiData);
      
      // Set user from response (token is automatically stored by authService)
      // Convert snake_case to camelCase
      setUser(toCamelCase(response.user));
      
      return { success: true, user: toCamelCase(response.user) };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Registration failed'
      };
    }
  };

  const login = async (emailOrPhone, password) => {
    try {
      // API expects 'email' field (backend should handle both email and phone)
      const credentials = {
        email: emailOrPhone, // Backend will check if it's email or phone
        password: password
      };

      const response = await authService.login(credentials);
      
      // Set user from response (token is automatically stored by authService)
      // Convert snake_case to camelCase
      setUser(toCamelCase(response.user));
      
      return { success: true, user: toCamelCase(response.user) };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateUser = async (updates) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      // Transform updates to match API format (camelCase to snake_case)
      const apiUpdates = {};
      if (updates.firstName) apiUpdates.first_name = updates.firstName;
      if (updates.lastName) apiUpdates.last_name = updates.lastName;
      if (updates.phone) apiUpdates.phone = updates.phone;
      if (updates.dateOfBirth) apiUpdates.date_of_birth = updates.dateOfBirth;

      const updatedUser = await userService.updateProfile(apiUpdates);
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update user error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Update failed'
      };
    }
  };

  const addAddress = async (address) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      // Transform address to match API format
      const apiAddress = {
        type: address.type || 'shipping',
        first_name: address.firstName,
        last_name: address.lastName,
        company: address.company || '',
        address_line_1: address.addressLine1,
        address_line_2: address.addressLine2 || '',
        city: address.city,
        state: address.state,
        postal_code: address.postalCode,
        country: address.country,
        phone: address.phone || '',
        is_default: address.isDefault || false
      };

      const newAddress = await userService.addAddress(apiAddress);
      
      // Update user's addresses in state
      const updatedUser = {
        ...user,
        addresses: [...(user.addresses || []), newAddress]
      };
      setUser(updatedUser);
      
      return { success: true, address: newAddress };
    } catch (error) {
      console.error('Add address error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Failed to add address'
      };
    }
  };

  const updateAddress = async (addressId, updates) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      // Transform updates to match API format
      const apiUpdates = {};
      if (updates.firstName) apiUpdates.first_name = updates.firstName;
      if (updates.lastName) apiUpdates.last_name = updates.lastName;
      if (updates.company !== undefined) apiUpdates.company = updates.company;
      if (updates.addressLine1) apiUpdates.address_line_1 = updates.addressLine1;
      if (updates.addressLine2 !== undefined) apiUpdates.address_line_2 = updates.addressLine2;
      if (updates.city) apiUpdates.city = updates.city;
      if (updates.state) apiUpdates.state = updates.state;
      if (updates.postalCode) apiUpdates.postal_code = updates.postalCode;
      if (updates.country) apiUpdates.country = updates.country;
      if (updates.phone !== undefined) apiUpdates.phone = updates.phone;
      if (updates.isDefault !== undefined) apiUpdates.is_default = updates.isDefault;

      const updatedAddress = await userService.updateAddress(addressId, apiUpdates);
      
      // Update user's addresses in state
      const updatedAddresses = user.addresses.map(addr => 
        addr.id === addressId ? updatedAddress : addr
      );
      const updatedUser = { ...user, addresses: updatedAddresses };
      setUser(updatedUser);
      
      return { success: true, address: updatedAddress };
    } catch (error) {
      console.error('Update address error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Failed to update address'
      };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      await userService.deleteAddress(addressId);
      
      // Update user's addresses in state
      const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
      const updatedUser = { ...user, addresses: updatedAddresses };
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Delete address error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Failed to delete address'
      };
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateUser,
    addAddress,
    updateAddress,
    deleteAddress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};