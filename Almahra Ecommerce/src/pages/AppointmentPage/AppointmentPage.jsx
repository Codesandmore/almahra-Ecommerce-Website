import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentContext';
import emailService from '../../services/emailService';
import AppointmentType from '../../components/appointment/AppointmentType/AppointmentType';
import AppointmentDetails from '../../components/appointment/AppointmentDetails/AppointmentDetails';
import AppointmentConfirmation from '../../components/appointment/AppointmentConfirmation/AppointmentConfirmation';
import './AppointmentPage.css';

const AppointmentPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { addAppointment } = useAppointments();
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState({
    type: '',
    service: '',
    location: '',
    date: '',
    time: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: '+91',
      notes: ''
    }
  });

  const handleTypeSelect = (type, service) => {
    setAppointmentData({
      ...appointmentData,
      type,
      service
    });
    setCurrentStep(2);
  };

  const handleDetailsSubmit = (details) => {
    setAppointmentData({
      ...appointmentData,
      ...details
    });
    setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = async () => {
    // Save appointment
    const savedAppointment = addAppointment(appointmentData);
    console.log('Appointment Confirmed:', savedAppointment);
    
    // Send confirmation email
    await emailService.sendAppointmentConfirmation(
      savedAppointment, 
      savedAppointment.personalInfo.email
    );
    
    // Show success message
    alert('Appointment booked successfully! A confirmation email has been sent to your email address.');
    
    // Redirect to profile page
    navigate('/profile');
  };

  return (
    <div className="appointment-page">
      <div className="appointment-page__container">
        <div className="appointment-page__header">
          <h1>Book an Appointment</h1>
          <div className="appointment-page__steps">
            <div className={`step ${currentStep >= 1 ? 'step--active' : ''} ${currentStep > 1 ? 'step--completed' : ''}`}>
              <span className="step__number">1</span>
              <span className="step__label">Select Type</span>
            </div>
            <div className="step-divider"></div>
            <div className={`step ${currentStep >= 2 ? 'step--active' : ''} ${currentStep > 2 ? 'step--completed' : ''}`}>
              <span className="step__number">2</span>
              <span className="step__label">Details</span>
            </div>
            <div className="step-divider"></div>
            <div className={`step ${currentStep >= 3 ? 'step--active' : ''}`}>
              <span className="step__number">3</span>
              <span className="step__label">Confirm</span>
            </div>
          </div>
        </div>

        <div className="appointment-page__content">
          {currentStep === 1 && (
            <AppointmentType onSelect={handleTypeSelect} />
          )}
          
          {currentStep === 2 && (
            <AppointmentDetails 
              appointmentData={appointmentData}
              onSubmit={handleDetailsSubmit}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 3 && (
            <AppointmentConfirmation 
              appointmentData={appointmentData}
              onConfirm={handleConfirm}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;