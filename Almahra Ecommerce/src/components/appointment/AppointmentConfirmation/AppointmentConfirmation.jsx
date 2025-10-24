import React from 'react';
import './AppointmentConfirmation.css';

const AppointmentConfirmation = ({ appointmentData, onConfirm, onBack }) => {
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
      mapLink: 'https://g.co/kgs/ijW1MLa'
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

  const selectedLocation = locations.find(loc => loc.id === appointmentData.location);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="appointment-confirmation">
      <div className="confirmation-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <div className="confirmation-header__content">
          <div className="confirmation-icon">✓</div>
          <h2>Confirm Your Appointment</h2>
          <p>Please review your appointment details before confirming</p>
        </div>
      </div>

      <div className="confirmation-content">
        {/* Appointment Details Card */}
        <div className="confirmation-card">
          <div className="confirmation-card__header">
            <h3>📅 Appointment Details</h3>
          </div>
          <div className="confirmation-card__body">
            <div className="detail-row">
              <span className="detail-label">Service Type:</span>
              <span className="detail-value">{appointmentData.type}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Service:</span>
              <span className="detail-value">{appointmentData.service?.name}</span>
            </div>
          </div>
        </div>

        {/* Location Card */}
        <div className="confirmation-card">
          <div className="confirmation-card__header">
            <h3>📍 Location</h3>
          </div>
          <div className="confirmation-card__body">
            <div className="detail-row">
              <span className="detail-label">Branch:</span>
              <span className="detail-value">{selectedLocation?.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{selectedLocation?.address}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{selectedLocation?.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Map:</span>
              <span className="detail-value">
                <a 
                  href={selectedLocation?.mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  📍 View on Google Maps
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Date & Time Card */}
        <div className="confirmation-card">
          <div className="confirmation-card__header">
            <h3>🕐 Date & Time</h3>
          </div>
          <div className="confirmation-card__body">
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value detail-value--highlight">
                {formatDate(appointmentData.date)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Time:</span>
              <span className="detail-value detail-value--highlight">
                {appointmentData.time}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="confirmation-card">
          <div className="confirmation-card__header">
            <h3>👤 Personal Information</h3>
          </div>
          <div className="confirmation-card__body">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">
                {appointmentData.personalInfo.firstName} {appointmentData.personalInfo.lastName}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{appointmentData.personalInfo.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{appointmentData.personalInfo.phone}</span>
            </div>
            {appointmentData.personalInfo.notes && (
              <div className="detail-row detail-row--full">
                <span className="detail-label">Notes:</span>
                <span className="detail-value">{appointmentData.personalInfo.notes}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="confirmation-notice">
        <h4>📋 Important Information</h4>
        <ul>
          <li><strong>Free Eye Checkup Available at All Branches!</strong></li>
          <li><strong>Working Hours:</strong> Saturday to Thursday: 9:30 AM - 11:00 PM | Friday: 3:00 PM - 11:00 PM</li>
          <li>Please arrive 10 minutes before your scheduled appointment time</li>
          <li>Bring any relevant medical records or prescriptions</li>
          <li>If you need to cancel or reschedule, please contact us at least 24 hours in advance</li>
          <li>A confirmation email will be sent to your registered email address</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="confirmation-actions">
        <button type="button" className="btn btn--secondary btn--large" onClick={onBack}>
          Edit Details
        </button>
        <button type="button" className="btn btn--primary btn--large" onClick={onConfirm}>
          Confirm Appointment
        </button>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;