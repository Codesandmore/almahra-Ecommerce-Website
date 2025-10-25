// Country codes and phone validation data
export const countryCodes = [
  { code: '+1', country: 'United States', flag: '🇺🇸', minLength: 10, maxLength: 10, format: '(XXX) XXX-XXXX', iso: 'US' },
  { code: '+1', country: 'Canada', flag: '🇨🇦', minLength: 10, maxLength: 10, format: '(XXX) XXX-XXXX', iso: 'CA' },
  { code: '+91', country: 'India', flag: '🇮🇳', minLength: 10, maxLength: 10, format: 'XXXXX XXXXX' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', minLength: 10, maxLength: 11, format: 'XXXX XXX XXXX' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', minLength: 10, maxLength: 12, format: 'XXX XXXXXXXX' },
  { code: '+33', country: 'France', flag: '🇫🇷', minLength: 9, maxLength: 9, format: 'X XX XX XX XX' },
  { code: '+39', country: 'Italy', flag: '🇮🇹', minLength: 9, maxLength: 11, format: 'XXX XXX XXXX' },
  { code: '+34', country: 'Spain', flag: '🇪🇸', minLength: 9, maxLength: 9, format: 'XXX XXX XXX' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', minLength: 10, maxLength: 11, format: 'XX XXXX XXXX' },
  { code: '+86', country: 'China', flag: '🇨🇳', minLength: 11, maxLength: 11, format: 'XXX XXXX XXXX' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷', minLength: 9, maxLength: 11, format: 'XX XXXX XXXX' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', minLength: 9, maxLength: 9, format: 'XXX XXX XXX' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷', minLength: 10, maxLength: 11, format: 'XX XXXXX XXXX' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽', minLength: 10, maxLength: 10, format: 'XXX XXX XXXX' },
  { code: '+7', country: 'Russia', flag: '🇷🇺', minLength: 10, maxLength: 10, format: 'XXX XXX XXXX' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦', minLength: 9, maxLength: 9, format: 'XX XXX XXXX' },
  { code: '+971', country: 'UAE', flag: '🇦🇪', minLength: 8, maxLength: 9, format: 'XX XXX XXXX' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦', minLength: 8, maxLength: 8, format: 'XXXX XXXX' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', minLength: 8, maxLength: 9, format: 'XX XXX XXXX' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', minLength: 8, maxLength: 8, format: 'XXXX XXXX' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾', minLength: 9, maxLength: 10, format: 'XX XXX XXXX' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱', minLength: 9, maxLength: 9, format: 'XX XXX XXXX' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪', minLength: 9, maxLength: 9, format: 'XXX XXX XXX' },
  { code: '+47', country: 'Norway', flag: '🇳🇴', minLength: 8, maxLength: 8, format: 'XXXX XXXX' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰', minLength: 8, maxLength: 8, format: 'XX XX XX XX' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭', minLength: 9, maxLength: 9, format: 'XXX XXX XXX' },
  { code: '+43', country: 'Austria', flag: '🇦🇹', minLength: 10, maxLength: 11, format: 'XXX XXXXXXX' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪', minLength: 9, maxLength: 9, format: 'XXX XX XX XX' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹', minLength: 9, maxLength: 9, format: 'XXX XXX XXX' },
  { code: '+30', country: 'Greece', flag: '🇬🇷', minLength: 10, maxLength: 10, format: 'XXX XXX XXXX' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷', minLength: 10, maxLength: 10, format: 'XXX XXX XXXX' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬', minLength: 10, maxLength: 11, format: 'XXX XXX XXXX' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬', minLength: 10, maxLength: 10, format: 'XXX XXX XXXX' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪', minLength: 9, maxLength: 9, format: 'XXX XXX XXX' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰', minLength: 10, maxLength: 10, format: 'XXX XXX XXXX' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩', minLength: 10, maxLength: 10, format: 'XXXX XXXXXX' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰', minLength: 9, maxLength: 9, format: 'XX XXX XXXX' },
  { code: '+95', country: 'Myanmar', flag: '🇲🇲', minLength: 8, maxLength: 10, format: 'XX XXX XXXX' }
];

// Get country data by country code
export const getCountryByCode = (code) => {
  return countryCodes.find(country => country.code === code);
};

// Validate phone number based on country code
export const validatePhoneNumber = (countryCode, phoneNumber) => {
  const country = getCountryByCode(countryCode);
  if (!country) {
    return { isValid: false, error: 'Invalid country code' };
  }

  // Remove all non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  if (cleanNumber.length < country.minLength) {
    return { 
      isValid: false, 
      error: `Phone number must be at least ${country.minLength} digits for ${country.country}` 
    };
  }
  
  if (cleanNumber.length > country.maxLength) {
    return { 
      isValid: false, 
      error: `Phone number must not exceed ${country.maxLength} digits for ${country.country}` 
    };
  }

  // Additional validation patterns for specific countries
  if (countryCode === '+91') {
    // India - must start with 6, 7, 8, or 9
    if (!/^[6-9]/.test(cleanNumber)) {
      return { isValid: false, error: 'Indian mobile numbers must start with 6, 7, 8, or 9' };
    }
  } else if (countryCode === '+1') {
    // US/Canada - area code cannot start with 0 or 1
    if (/^[01]/.test(cleanNumber)) {
      return { isValid: false, error: 'US/Canada area code cannot start with 0 or 1' };
    }
  } else if (countryCode === '+44') {
    // UK - mobile numbers start with 7
    if (cleanNumber.length === 11 && !/^7/.test(cleanNumber)) {
      return { isValid: false, error: 'UK mobile numbers must start with 7' };
    }
  } else if (countryCode === '+49') {
    // Germany - mobile numbers start with 15, 16, or 17
    if (!/^1[567]/.test(cleanNumber)) {
      return { isValid: false, error: 'German mobile numbers must start with 15, 16, or 17' };
    }
  } else if (countryCode === '+33') {
    // France - mobile numbers start with 6 or 7
    if (!/^[67]/.test(cleanNumber)) {
      return { isValid: false, error: 'French mobile numbers must start with 6 or 7' };
    }
  } else if (countryCode === '+39') {
    // Italy - mobile numbers start with 3
    if (!/^3/.test(cleanNumber)) {
      return { isValid: false, error: 'Italian mobile numbers must start with 3' };
    }
  } else if (countryCode === '+81') {
    // Japan - mobile numbers start with 70, 80, or 90
    if (!/^[789]0/.test(cleanNumber)) {
      return { isValid: false, error: 'Japanese mobile numbers must start with 70, 80, or 90' };
    }
  } else if (countryCode === '+86') {
    // China - mobile numbers start with 1
    if (!/^1/.test(cleanNumber)) {
      return { isValid: false, error: 'Chinese mobile numbers must start with 1' };
    }
  } else if (countryCode === '+61') {
    // Australia - mobile numbers start with 4
    if (!/^4/.test(cleanNumber)) {
      return { isValid: false, error: 'Australian mobile numbers must start with 4' };
    }
  } else if (countryCode === '+55') {
    // Brazil - mobile numbers start with 9 (after area code)
    if (cleanNumber.length === 11 && !/^[1-9][1-9]9/.test(cleanNumber)) {
      return { isValid: false, error: 'Brazilian mobile numbers must have 9 as third digit' };
    }
  } else if (countryCode === '+971') {
    // UAE - mobile numbers start with 5
    if (!/^5/.test(cleanNumber)) {
      return { isValid: false, error: 'UAE mobile numbers must start with 5' };
    }
  } else if (countryCode === '+966') {
    // Saudi Arabia - mobile numbers start with 5
    if (!/^5/.test(cleanNumber)) {
      return { isValid: false, error: 'Saudi Arabian mobile numbers must start with 5' };
    }
  } else if (countryCode === '+65') {
    // Singapore - mobile numbers start with 8 or 9
    if (!/^[89]/.test(cleanNumber)) {
      return { isValid: false, error: 'Singapore mobile numbers must start with 8 or 9' };
    }
  } else if (countryCode === '+60') {
    // Malaysia - mobile numbers start with 1 (after removing leading 0)
    if (!/^1/.test(cleanNumber)) {
      return { isValid: false, error: 'Malaysian mobile numbers must start with 1' };
    }
  } else if (countryCode === '+31') {
    // Netherlands - mobile numbers start with 6
    if (!/^6/.test(cleanNumber)) {
      return { isValid: false, error: 'Dutch mobile numbers must start with 6' };
    }
  } else if (countryCode === '+90') {
    // Turkey - mobile numbers start with 5
    if (!/^5/.test(cleanNumber)) {
      return { isValid: false, error: 'Turkish mobile numbers must start with 5' };
    }
  } else if (countryCode === '+92') {
    // Pakistan - mobile numbers start with 3
    if (!/^3/.test(cleanNumber)) {
      return { isValid: false, error: 'Pakistani mobile numbers must start with 3' };
    }
  } else if (countryCode === '+234') {
    // Nigeria - mobile numbers start with 7, 8, or 9
    if (!/^[789]/.test(cleanNumber)) {
      return { isValid: false, error: 'Nigerian mobile numbers must start with 7, 8, or 9' };
    }
  } else if (countryCode === '+94') {
    // Sri Lanka - mobile numbers start with 7
    if (!/^7/.test(cleanNumber)) {
      return { isValid: false, error: 'Sri Lankan mobile numbers must start with 7' };
    }
  }

  return { 
    isValid: true, 
    formattedNumber: `${countryCode} ${phoneNumber}`,
    cleanNumber: `${countryCode}${cleanNumber}`
  };
};

// Format phone number display
export const formatPhoneNumber = (countryCode, phoneNumber) => {
  const country = getCountryByCode(countryCode);
  if (!country) return phoneNumber;

  const cleanNumber = phoneNumber.replace(/\D/g, '');
  let formatted = cleanNumber;

  // Apply basic formatting based on country
  if (countryCode === '+91' && cleanNumber.length === 10) {
    formatted = `${cleanNumber.slice(0, 5)} ${cleanNumber.slice(5)}`;
  } else if (countryCode === '+1' && cleanNumber.length === 10) {
    formatted = `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;
  } else if (countryCode === '+44' && cleanNumber.length >= 10) {
    formatted = `${cleanNumber.slice(0, 4)} ${cleanNumber.slice(4, 7)} ${cleanNumber.slice(7)}`;
  }

  return `${countryCode} ${formatted}`;
};