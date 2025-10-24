import React from 'react';
import './AppointmentType.css';

const AppointmentType = ({ onSelect }) => {
  const appointmentTypes = [
    {
      id: 'eye-test',
      title: 'Eye Test',
      icon: '👁️',
      description: 'Comprehensive eye examination and vision testing',
      services: [
        { id: 'comprehensive', name: 'Comprehensive Eye Exam' },
        { id: 'license-test', name: 'License Test' },
        { id: 'contact-lens', name: 'Contact Lens Exam' }
      ]
    },
    {
      id: 'consultation',
      title: 'Consultation',
      icon: '👨‍⚕️',
      description: 'Expert consultation for eye-related concerns',
      services: [
        { id: 'general', name: 'General Eye Consultation' },
        { id: 'follow-up', name: 'Follow-up Visit' }
      ]
    },
    {
      id: 'lens-fitting',
      title: 'Lens Fitting',
      icon: '🔍',
      description: 'Professional lens fitting and adjustment',
      services: [
        { id: 'eyeglass', name: 'Eyeglass Lens Fitting' },
        { id: 'contact', name: 'Contact Lens Fitting' },
        { id: 'adjustment', name: 'Frame Adjustment' }
      ]
    },
    {
      id: 'frame-selection',
      title: 'Frame Selection',
      icon: '👓',
      description: 'Personalized frame selection assistance',
      services: [
        { id: 'consultation', name: 'Frame Style Consultation' },
        { id: 'fitting', name: 'Frame Fitting & Adjustment' }
      ]
    }
  ];

  const [selectedType, setSelectedType] = React.useState(null);
  const [selectedService, setSelectedService] = React.useState(null);

  const handleTypeClick = (typeId) => {
    setSelectedType(typeId);
    setSelectedService(null);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleContinue = () => {
    if (selectedType && selectedService) {
      const type = appointmentTypes.find(t => t.id === selectedType);
      onSelect(type.title, selectedService);
    }
  };

  return (
    <div className="appointment-type">
      <div className="appointment-type__header">
        <h2>Select Appointment Type</h2>
        <p>Choose the type of service you need</p>
      </div>

      <div className="appointment-type__grid">
        {appointmentTypes.map((type) => (
          <div key={type.id} className="appointment-type__section">
            <button
              className={`appointment-card ${selectedType === type.id ? 'appointment-card--selected' : ''}`}
              onClick={() => handleTypeClick(type.id)}
            >
              <span className="appointment-card__icon">{type.icon}</span>
              <h3 className="appointment-card__title">{type.title}</h3>
              <p className="appointment-card__description">{type.description}</p>
            </button>

            {selectedType === type.id && (
              <div className="services-list">
                <h4>Select Service</h4>
                <div className="services-grid">
                  {type.services.map((service) => (
                    <button
                      key={service.id}
                      className={`service-card ${selectedService?.id === service.id ? 'service-card--selected' : ''}`}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <div className="service-card__content">
                        <h5>{service.name}</h5>
                      </div>
                      <div className="service-card__checkbox">
                        {selectedService?.id === service.id && <span>✓</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedType && selectedService && (
        <div className="appointment-type__footer">
          <button className="btn btn--primary btn--large" onClick={handleContinue}>
            Continue to Details
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentType;