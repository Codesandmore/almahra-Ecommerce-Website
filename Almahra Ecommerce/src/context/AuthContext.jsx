import React, { createContext, useContext, useState, useEffect } from 'react';
import emailService from '../services/emailService';

const AuthContext = createContext();

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

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('almahra_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('almahra_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('almahra_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('almahra_user');
    }
  }, [user]);

  const register = async (userData) => {
    try {
      // In a real app, this would be an API call
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        password: userData.password, // Store password (in production, this should be hashed)
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || '',
        createdAt: new Date().toISOString(),
        addresses: [],
        orders: [],
        wishlist: []
      };

      // Check if user already exists (simulate API validation)
      const existingUsers = JSON.parse(localStorage.getItem('almahra_users') || '[]');
      const emailExists = existingUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      
      if (emailExists) {
        throw new Error('User with this email already exists');
      }

      // Check if phone number already exists
      if (userData.phone) {
        const cleanNewPhone = userData.phone.replace(/[\s\-()]/g, '');
        const phoneExists = existingUsers.find(u => {
          const cleanUserPhone = u.phone ? u.phone.replace(/[\s\-()]/g, '') : '';
          return cleanUserPhone === cleanNewPhone;
        });
        
        if (phoneExists) {
          throw new Error('User with this phone number already exists');
        }
      }

      // Save to users list
      existingUsers.push(newUser);
      localStorage.setItem('almahra_users', JSON.stringify(existingUsers));

      setUser(newUser);
      
      // Send welcome email
      await emailService.sendWelcomeEmail(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (emailOrPhone, password) => {
    try {
      // In a real app, this would be an API call with proper password verification
      const existingUsers = JSON.parse(localStorage.getItem('almahra_users') || '[]');
      
      // Check if input is email or phone
      const isEmail = emailOrPhone.includes('@');
      let foundUser;
      
      if (isEmail) {
        foundUser = existingUsers.find(u => u.email.toLowerCase() === emailOrPhone.toLowerCase());
      } else {
        // Clean phone number for comparison (remove spaces, dashes, etc.)
        const cleanInput = emailOrPhone.replace(/[\s\-()]/g, '');
        foundUser = existingUsers.find(u => {
          const cleanUserPhone = u.phone ? u.phone.replace(/[\s\-()]/g, '') : '';
          return cleanUserPhone === cleanInput;
        });
      }
      
      if (!foundUser) {
        throw new Error('No account found with this ' + (isEmail ? 'email' : 'phone number'));
      }

      // Verify password
      // In a real app, you'd verify the password hash
      if (!password || password !== foundUser.password) {
        throw new Error('Invalid password');
      }

      setUser(foundUser);
      return { success: true, user: foundUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = async (updates) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const updatedUser = { ...user, ...updates };
      
      // Update in users list
      const existingUsers = JSON.parse(localStorage.getItem('almahra_users') || '[]');
      const userIndex = existingUsers.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        existingUsers[userIndex] = updatedUser;
        localStorage.setItem('almahra_users', JSON.stringify(existingUsers));
      }

      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addAddress = async (address) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const newAddress = {
        id: Date.now().toString(),
        ...address,
        createdAt: new Date().toISOString()
      };

      const updatedAddresses = [...(user.addresses || []), newAddress];
      return await updateUser({ addresses: updatedAddresses });
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateAddress = async (addressId, updates) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const updatedAddresses = user.addresses.map(addr => 
        addr.id === addressId ? { ...addr, ...updates } : addr
      );
      
      return await updateUser({ addresses: updatedAddresses });
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
      return await updateUser({ addresses: updatedAddresses });
    } catch (error) {
      return { success: false, error: error.message };
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