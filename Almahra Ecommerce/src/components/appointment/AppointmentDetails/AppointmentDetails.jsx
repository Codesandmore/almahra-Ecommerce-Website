import React, { useState } from 'react';
import PhoneInput from '../../common/PhoneInput/PhoneInput';
import './AppointmentDetails.css';

const AppointmentDetails = ({ appointmentData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    location: appointmentData.location || '',
    date: appointmentData.date || '',
    time: appointmentData.time || '',
    firstName: appointmentData.personalInfo?.firstName || '',
    lastName: appointmentData.personalInfo?.lastName || '',
    email: appointmentData.personalInfo?.email || '',
    phone: appointmentData.personalInfo?.phone || '',
    countryCode: appointmentData.personalInfo?.countryCode || '+91',
    notes: appointmentData.personalInfo?.notes || ''
  });

  const [errors, setErrors] = useState({});
  const [phoneValidation, setPhoneValidation] = useState({ isValid: false });

  // Almahra Opticals Branches in Qatar
  const locations = [
    { 
      id: 'al-munthaza', 
      name: 'Al Munthaza Branch', 
      address: 'Al Munthaza, Qatar',
      phone: '+974 3033 2307',
      mapLink: 'https://g.co/kgs/KzssCy'
    },
    { 
      id: 'al-wukair', 
      name: 'Al Wukair Branch', 
      address: 'Al Wukair, Qatar',
      phone: '+974 7111 2307',
      mapLink: 'https://g.co/kgs/ijW1MLa'
    },
    { 
      id: 'al-sadd', 
      name: 'Al Sadd Branch', 
      address: 'Al Sadd, Qatar',
      phone: '+974 7118 2307',
      mapLink: 'https://share.google/VCNjkVKBV3vCTJrgc'
    },
    { 
      id: 'al-khor', 
      name: 'Al Khor Branch', 
      address: 'Al Khor, Qatar',
      phone: '+974 7778 2307',
      mapLink: 'https://g.co/kgs/nrf71fy'
    },
    { 
      id: 'duhail', 
      name: 'Duhail Branch', 
      address: 'Duhail, Qatar',
      phone: '+974 7732 2307',
      mapLink: 'https://g.co/kgs/BJaGsJA'
    }
  ];

  // Check if selected date is Friday
  const isFriday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date.getDay() === 5; // Friday is day 5
  };

  // Generate available time slots based on day
  // Saturday to Thursday: 9:30 AM - 11:00 PM
  // Friday: 3:00 PM - 11:00 PM
  const getTimeSlots = () => {
    const fridaySlots = [
      '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
      '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
      '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM'
    ];

    const regularSlots = [
      '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
      '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
      '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
      '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM'
    ];

    return isFriday(formData.date) ? fridaySlots : regularSlots;
  };

  const timeSlots = getTimeSlots();

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePhoneChange = (phoneNumber) => {
    setFormData({
      ...formData,
      phone: phoneNumber
    });
    if (errors.phone) {
      setErrors({
        ...errors,
        phone: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.location) newErrors.location = 'Please select a location';
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.time) newErrors.time = 'Please select a time slot';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error || 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const details = {
        location: formData.location,
        date: formData.date,
        time: formData.time,
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          countryCode: formData.countryCode,
          notes: formData.notes
        }
      };
      onSubmit(details);
    }
  };

  const selectedLocation = locations.find(loc => loc.id === formData.location);

  return (
    <div className="appointment-details">
      <div className="appointment-details__header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <div>
          <h2>Appointment Details</h2>
          <p className="appointment-summary">
            {appointmentData.type} - {appointmentData.service?.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="appointment-form">
        {/* Location Selection */}
        <div className="form-section">
          <h3>Select Location</h3>
          <p className="info-text">
            <strong>Free Eye Checkup Available!</strong><br/>
            <strong>Working Hours:</strong> Saturday to Thursday: 9:30 AM - 11:00 PM | Friday: 3:00 PM - 11:00 PM
          </p>
          <div className="location-grid">
            {locations.map((location) => (
              <label
                key={location.id}
                className={`location-card ${formData.location === location.id ? 'location-card--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="location"
                  value={location.id}
                  checked={formData.location === location.id}
                  onChange={handleChange}
                  className="location-card__radio"
                />
                <div className="location-card__content">
                  <h4>{location.name}</h4>
                  <p className="location-address">{location.address}</p>
                  <p className="location-phone">📞 {location.phone}</p>
                  <a 
                    href={location.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="location-map-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    📍 View on Google Maps
                  </a>
                </div>
                <div className="location-card__check">
                  {formData.location === location.id && <span>✓</span>}
                </div>
              </label>
            ))}
          </div>
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>

        {/* Date & Time Selection */}
        <div className="form-section">
          <h3>Select Date & Time</h3>
          <div className="datetime-grid">
            <div className="form-group">
              <label htmlFor="date">Preferred Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={getMinDate()}
                max={getMaxDate()}
                className={errors.date ? 'input-error' : ''}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="time">Preferred Time</label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={errors.time ? 'input-error' : ''}
              >
                <option value="">Select time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              {errors.time && <span className="error-message">{errors.time}</span>}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className={errors.firstName ? 'input-error' : ''}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className={errors.lastName ? 'input-error' : ''}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <PhoneInput
                value={formData.phone}
                onChange={handlePhoneChange}
                onValidationChange={setPhoneValidation}
                error={errors.phone}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="form-group form-group--full">
              <label htmlFor="notes">Additional Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special requests or information we should know..."
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="button" className="btn btn--secondary" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="btn btn--primary btn--large">
            Continue to Confirmation
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentDetails;