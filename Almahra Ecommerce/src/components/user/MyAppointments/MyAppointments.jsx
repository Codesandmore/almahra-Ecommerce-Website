import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAppointments } from '../../../context/AppointmentContext';
import './MyAppointments.css';

const MyAppointments = () => {
  const { user } = useAuth();
  const { getUserAppointments, cancelAppointment } = useAppointments();
  
  const userAppointments = user ? getUserAppointments(user.email) : [];

  const locations = [
    { id: 'downtown', name: 'Downtown Branch', address: '123 Main Street, City Center' },
    { id: 'mall', name: 'Shopping Mall Branch', address: '456 Mall Avenue, East Side' },
    { id: 'suburb', name: 'Suburban Branch', address: '789 Green Road, North District' },
    { id: 'central', name: 'Central Station Branch', address: '321 Station Square, Central' }
  ];

  const getLocationName = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : locationId;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleCancel = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment(appointmentId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status--confirmed';
      case 'cancelled':
        return 'status--cancelled';
      case 'completed':
        return 'status--completed';
      default:
        return '';
    }
  };

  if (userAppointments.length === 0) {
    return (
      <div className="my-appointments">
        <div className="my-appointments__header">
          <h3>My Appointments</h3>
        </div>
        <div className="my-appointments__empty">
          <div className="empty-icon">📅</div>
          <p>You don't have any appointments yet</p>
          <a href="/appointment" className="btn btn--primary">Book Appointment</a>
        </div>
      </div>
    );
  }

  return (
    <div className="my-appointments">
      <div className="my-appointments__header">
        <h3>My Appointments</h3>
        <a href="/appointment" className="btn btn--primary btn--small">Book New</a>
      </div>

      <div className="appointments-list">
        {userAppointments.map((appointment) => (
          <div key={appointment.id} className={`appointment-card ${appointment.status === 'cancelled' ? 'appointment-card--cancelled' : ''}`}>
            <div className="appointment-card__header">
              <div className="appointment-card__type">
                <h4>{appointment.type}</h4>
                <p>{appointment.service?.name}</p>
              </div>
              <span className={`appointment-status ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>

            <div className="appointment-card__body">
              <div className="appointment-detail">
                <span className="detail-icon">📍</span>
                <div>
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{getLocationName(appointment.location)}</span>
                </div>
              </div>

              <div className="appointment-detail">
                <span className="detail-icon">📅</span>
                <div>
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{formatDate(appointment.date)}</span>
                </div>
              </div>

              <div className="appointment-detail">
                <span className="detail-icon">🕐</span>
                <div>
                  <span className="detail-label">Time</span>
                  <span className="detail-value">{appointment.time}</span>
                </div>
              </div>
            </div>

            {appointment.status === 'confirmed' && (
              <div className="appointment-card__actions">
                <button 
                  className="btn btn--secondary btn--small"
                  onClick={() => handleCancel(appointment.id)}
                >
                  Cancel Appointment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;