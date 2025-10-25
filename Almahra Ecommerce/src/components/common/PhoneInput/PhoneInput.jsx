import React, { useState, useEffect } from 'react';
import { countryCodes, validatePhoneNumber, formatPhoneNumber } from '../../../utils/phoneValidation';
import './PhoneInput.css';

const PhoneInput = ({ 
  value = '', 
  onChange, 
  onValidationChange,
  error = '',
  placeholder = 'Enter phone number',
  required = false,
  className = ''
}) => {
  const [countryCode, setCountryCode] = useState('+974');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Debug: Log all countries on component mount
  useEffect(() => {
    console.log('PhoneInput: Total countries loaded:', countryCodes.length);
    console.log('PhoneInput: Countries:', countryCodes.map(c => `${c.flag} ${c.country} ${c.code}`));
  }, []);

  const selectedCountry = countryCodes.find(country => country.code === countryCode);

  useEffect(() => {
    if (value) {
      // Parse existing value if provided
      const parts = value.split(' ');
      if (parts.length >= 2) {
        const code = parts[0];
        const number = parts.slice(1).join('');
        setCountryCode(code);
        setPhoneNumber(number);
      }
    }
  }, [value]);

  const handleCountryChange = (newCountryCode) => {
    setCountryCode(newCountryCode);
    setIsDropdownOpen(false);
    
    // Validate with new country code
    if (phoneNumber) {
      const validation = validatePhoneNumber(newCountryCode, phoneNumber);
      const fullNumber = `${newCountryCode} ${phoneNumber}`;
      
      if (onChange) {
        onChange(fullNumber);
      }
      
      if (onValidationChange) {
        onValidationChange(validation);
      }
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    
    const validation = validatePhoneNumber(countryCode, value);
    const fullNumber = `${countryCode} ${value}`;
    
    if (onChange) {
      onChange(fullNumber);
    }
    
    if (onValidationChange) {
      onValidationChange(validation);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.country-selector')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`phone-input ${className}`}>
      <div className="phone-input__container">
        <div className="country-selector">
          <button
            type="button"
            className="country-selector__button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="country-flag">{selectedCountry?.flag}</span>
            <span className="country-code">{countryCode}</span>
            <svg 
              className={`dropdown-arrow ${isDropdownOpen ? 'dropdown-arrow--open' : ''}`}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="country-dropdown">
              <div className="country-dropdown__content">
                {countryCodes.map((country, index) => (
                  <button
                    key={`${country.code}-${country.iso || country.country}-${index}`}
                    type="button"
                    className={`country-option ${country.code === countryCode ? 'country-option--selected' : ''}`}
                    onClick={() => handleCountryChange(country.code)}
                  >
                    <span className="country-flag">{country.flag}</span>
                    <span className="country-name">{country.country}</span>
                    <span className="country-code">{country.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          required={required}
          className={`phone-input__field ${error ? 'phone-input__field--error' : ''}`}
        />
      </div>
      
      {error && <span className="phone-input__error">{error}</span>}
      
      {selectedCountry && phoneNumber && (
        <div className="phone-input__help">
          Format: {selectedCountry.format.replace(/X/g, '0')}
        </div>
      )}
    </div>
  );
};

export default PhoneInput;