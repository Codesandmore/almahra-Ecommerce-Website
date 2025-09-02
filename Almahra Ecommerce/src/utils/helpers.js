// Utility functions for the Almahra Opticals ecommerce site

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format date
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
};

// Generate slug from string
export const generateSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting item from localStorage:`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in localStorage:`, error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage:`, error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
    }
  }
};

// Image optimization
export const getOptimizedImageUrl = (url, width = 400, height = 400, quality = 80) => {
  if (!url) return '/images/placeholder.svg';
  
  // For now, return the original URL
  // In production, you might use a service like Cloudinary or Next.js Image Optimization
  return url;
};

// Validation helpers
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  phone: (phone) => {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },
  
  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },
  
  minLength: (value, min) => {
    return value && value.toString().length >= min;
  },
  
  maxLength: (value, max) => {
    return value && value.toString().length <= max;
  }
};

// Array utilities
export const arrayUtils = {
  unique: (array, key = null) => {
    if (key) {
      return array.filter((item, index, self) => 
        index === self.findIndex(t => t[key] === item[key])
      );
    }
    return [...new Set(array)];
  },
  
  groupBy: (array, key) => {
    return array.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {});
  },
  
  sortBy: (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (direction === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }
};

// Price utilities
export const priceUtils = {
  calculateDiscount: (originalPrice, salePrice) => {
    if (originalPrice <= salePrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  },
  
  calculateTax: (subtotal, taxRate = 0.08) => {
    return subtotal * taxRate;
  },
  
  calculateShipping: (subtotal, freeShippingThreshold = 100) => {
    return subtotal >= freeShippingThreshold ? 0 : 10;
  },
  
  calculateTotal: (subtotal, tax = 0, shipping = 0, discount = 0) => {
    return subtotal + tax + shipping - discount;
  }
};

// Color utilities
export const colorUtils = {
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  
  rgbToHex: (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },
  
  isLight: (hex) => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return true;
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128;
  }
};

// Random utilities
export const randomUtils = {
  id: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
  
  number: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  boolean: () => {
    return Math.random() < 0.5;
  },
  
  arrayItem: (array) => {
    return array[Math.floor(Math.random() * array.length)];
  }
};

// URL utilities
export const urlUtils = {
  addParams: (url, params) => {
    const urlObj = new URL(url, window.location.origin);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        urlObj.searchParams.set(key, params[key]);
      }
    });
    return urlObj.toString();
  },
  
  removeParams: (url, paramKeys) => {
    const urlObj = new URL(url, window.location.origin);
    paramKeys.forEach(key => {
      urlObj.searchParams.delete(key);
    });
    return urlObj.toString();
  },
  
  getParams: (url = window.location.href) => {
    const urlObj = new URL(url);
    const params = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }
};
