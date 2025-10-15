import React, { useState } from 'react';
import Button from '../../common/Button/Button.jsx';
import './PersonalInfo.css';

const PersonalInfo = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    dateOfBirth: user.dateOfBirth || '',
    gender: user.gender || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="personal-info">
      <div className="personal-info__header">
        <h2 className="personal-info__title">Personal Information</h2>
        {!isEditing && (
          <Button
            variant="secondary"
            size="small"
            onClick={() => setIsEditing(true)}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            }
          >
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <form className="personal-info__form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className="form-input form-input--readonly"
                readOnly
                disabled
              />
              <small className="form-help">Email cannot be changed</small>
            </div>
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary" size="medium">
              Save Changes
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              size="medium"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="personal-info__content">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Full Name</span>
              <span className="info-value">{user.firstName} {user.lastName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value">
                {user.email}
                <small className="info-note">Cannot be changed</small>
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone Number</span>
              <span className="info-value">
                {user.phone || <span className="info-placeholder" onClick={() => setIsEditing(true)}>Add phone number</span>}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Date of Birth</span>
              <span className="info-value">
                {user.dateOfBirth ? formatDate(user.dateOfBirth) : <span className="info-placeholder" onClick={() => setIsEditing(true)}>Add date of birth</span>}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Gender</span>
              <span className="info-value">
                {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : <span className="info-placeholder" onClick={() => setIsEditing(true)}>Add gender</span>}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;