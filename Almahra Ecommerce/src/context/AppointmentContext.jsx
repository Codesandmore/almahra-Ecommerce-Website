import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import emailService from '../services/emailService';

const AppointmentContext = createContext();

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const { user } = useAuth();

  // Load appointments from localStorage on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (appointmentData) => {
    const newAppointment = {
      id: Date.now().toString(),
      ...appointmentData,
      userId: user?.email || 'guest',
      bookedAt: new Date().toISOString(),
      status: 'confirmed'
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const getUserAppointments = (userEmail) => {
    return appointments.filter(apt => apt.userId === userEmail);
  };

  const cancelAppointment = async (appointmentId) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (appointment) {
      // Send cancellation email
      await emailService.sendAppointmentCancellation(
        appointment,
        appointment.personalInfo.email
      );
    }
    
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' }
          : apt
      )
    );
  };

  const getAllAppointments = () => {
    return appointments;
  };

  const value = {
    appointments,
    addAppointment,
    getUserAppointments,
    cancelAppointment,
    getAllAppointments
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};
