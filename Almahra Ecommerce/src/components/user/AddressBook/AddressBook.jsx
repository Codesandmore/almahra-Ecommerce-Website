import React, { useState } from 'react';
import Button from '../../common/Button/Button.jsx';
import PhoneInput from '../../common/PhoneInput/PhoneInput.jsx';
import './AddressBook.css';

const AddressBook = ({ addresses, onAddAddress, onUpdateAddress, onDeleteAddress }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
    isDefault: false
  });

  const resetForm = () => {
    setFormData({
      type: 'home',
      firstName: '',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      phone: '',
      isDefault: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onUpdateAddress(editingId, formData);
      setEditingId(null);
    } else {
      onAddAddress(formData);
      setIsAdding(false);
    }
    resetForm();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setIsAdding(false);
  };

  const handleDelete = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      onDeleteAddress(addressId);
    }
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case 'home':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        );
      case 'office':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 21h18M5 21V7l8-4v18M13 9h4v12M9 9v12M9 12h2M9 16h2"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        );
    }
  };

  return (
    <div className="address-book">
      <div className="address-book__header">
        <div>
          <h2 className="address-book__title">Address Book</h2>
          <p className="address-book__subtitle">
            Manage your delivery addresses
          </p>
        </div>
        <Button
          variant="primary"
          size="medium"
          onClick={() => setIsAdding(true)}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          }
        >
          Add New Address
        </Button>
      </div>

      {(isAdding || editingId) && (
        <div className="address-form-container">
          <h3 className="address-form__title">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>
          <form className="address-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type" className="form-label">
                  Address Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                  />
                  <span className="form-checkbox__checkmark"></span>
                  Set as default address
                </label>
              </div>
            </div>

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

            <div className="form-group">
              <label htmlFor="addressLine1" className="form-label">
                Address Line 1
              </label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Street address, P.O. box, company name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="addressLine2" className="form-label">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="state" className="form-label">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="postalCode" className="form-label">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <PhoneInput
                  value={formData.phone}
                  onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary" size="medium">
                {editingId ? 'Update Address' : 'Save Address'}
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
        </div>
      )}

      {addresses && addresses.length > 0 ? (
        <div className="addresses-grid">
          {addresses.map((address) => (
            <div key={address.id} className="address-card">
              <div className="address-card__header">
                <div className="address-type">
                  <span className="address-type__icon">
                    {getAddressTypeIcon(address.type)}
                  </span>
                  <span className="address-type__label">
                    {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                  </span>
                  {address.isDefault && (
                    <span className="address-default-badge">Default</span>
                  )}
                </div>
                <div className="address-card__actions">
                  <button
                    className="address-action-btn"
                    onClick={() => handleEdit(address)}
                    title="Edit address"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    className="address-action-btn address-action-btn--danger"
                    onClick={() => handleDelete(address.id)}
                    title="Delete address"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="address-card__content">
                <div className="address-name">
                  {address.firstName} {address.lastName}
                </div>
                <div className="address-details">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>{address.city}, {address.state} {address.postalCode}</p>
                  <p>{address.country}</p>
                  <p className="address-phone">{address.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isAdding && (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 className="empty-state__title">No Addresses Saved</h3>
            <p className="empty-state__message">
              Add your delivery addresses to make checkout faster and easier.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default AddressBook;