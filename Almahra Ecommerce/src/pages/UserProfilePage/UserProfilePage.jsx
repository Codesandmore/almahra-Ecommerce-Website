import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../../components/user/ProfileHeader/ProfileHeader.jsx';
import ProfileTabs from '../../components/user/ProfileTabs/ProfileTabs.jsx';
import PersonalInfo from '../../components/user/PersonalInfo/PersonalInfo.jsx';
import OrderHistory from '../../components/user/OrderHistory/OrderHistory.jsx';
import AddressBook from '../../components/user/AddressBook/AddressBook.jsx';
import MyAppointments from '../../components/user/MyAppointments/MyAppointments.jsx';
import orderService from '../../services/orderService.js';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal-info');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user, isAuthenticated, updateUser, addAddress, updateAddress, deleteAddress } = useAuth();
  const navigate = useNavigate();

  // Fetch user orders and wishlist
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        return;
      }
      
      try {
        setLoading(true);
        // Fetch orders
        const ordersResponse = await orderService.getUserOrders();
        setOrders(ordersResponse.orders || []);
        
        // TODO: Implement wishlist API
        // const wishlistResponse = await wishlistService.getWishlist();
        // setWishlist(wishlistResponse.items || []);
        setWishlist([]); // Empty for now
      } catch (err) {
        console.error('Error fetching user data:', err);
        // Don't show error, just use empty arrays
        setOrders([]);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Show loading or redirect if no user
  if (!user || loading) {
    return (
      <div className="user-profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleUpdateUser = async (updatedData) => {
    const result = await updateUser(updatedData);
    if (result.success) {
      console.log('User updated successfully:', updatedData);
    } else {
      console.error('Failed to update user:', result.error);
    }
  };

  const handleEditProfile = () => {
    setActiveTab('personal-info');
  };

  const handleAddAddress = async (newAddress) => {
    const result = await addAddress(newAddress);
    if (result.success) {
      console.log('Address added successfully:', newAddress);
    } else {
      console.error('Failed to add address:', result.error);
    }
  };

  const handleUpdateAddress = async (addressId, updatedData) => {
    const result = await updateAddress(addressId, updatedData);
    if (result.success) {
      console.log('Address updated successfully:', updatedData);
    } else {
      console.error('Failed to update address:', result.error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const result = await deleteAddress(addressId);
    if (result.success) {
      console.log('Address deleted successfully:', addressId);
    } else {
      console.error('Failed to delete address:', result.error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal-info':
        return (
          <PersonalInfo 
            user={user} 
            onUpdateUser={handleUpdateUser} 
          />
        );
      case 'orders':
        return (
          <OrderHistory orders={orders} />
        );
      case 'appointments':
        return (
          <MyAppointments />
        );
      case 'addresses':
        return (
          <AddressBook 
            addresses={user.addresses || []}
            onAddAddress={handleAddAddress}
            onUpdateAddress={handleUpdateAddress}
            onDeleteAddress={handleDeleteAddress}
          />
        );
      case 'wishlist':
        return (
          <WishlistTab wishlist={wishlist} />
        );
      case 'prescription':
        return (
          <PrescriptionTab prescription={user.eyePrescription} />
        );
      default:
        return (
          <PersonalInfo 
            user={user} 
            onUpdateUser={handleUpdateUser} 
          />
        );
    }
  };

  return (
    <div className="user-profile-page">
      <ProfileHeader 
        user={user} 
        onEditProfile={handleEditProfile} 
      />
      
      <ProfileTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <div className="profile-content">
        <div className="profile-content__container">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Wishlist Tab Component
const WishlistTab = ({ wishlist }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="wishlist-tab">
      <div className="wishlist-tab__header">
        <h2 className="wishlist-tab__title">My Wishlist</h2>
        <p className="wishlist-tab__subtitle">
          Items you've saved for later
        </p>
      </div>

      {wishlist && wishlist.length > 0 ? (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-item">
              <div className="wishlist-item__image">
                <img src={item.image} alt={item.name} />
                {!item.inStock && (
                  <div className="out-of-stock-overlay">
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>
              
              <div className="wishlist-item__content">
                <h3 className="wishlist-item__name">{item.name}</h3>
                <p className="wishlist-item__brand">{item.brand}</p>
                <div className="wishlist-item__price">
                  <span className="current-price">{formatPrice(item.price)}</span>
                  {item.originalPrice > item.price && (
                    <span className="original-price">{formatPrice(item.originalPrice)}</span>
                  )}
                </div>
                <p className="wishlist-item__date">
                  Added on {formatDate(item.addedDate)}
                </p>
              </div>
              
              <div className="wishlist-item__actions">
                <button 
                  className="btn btn-primary btn-small"
                  disabled={!item.inStock}
                >
                  {item.inStock ? 'Add to Cart' : 'Notify When Available'}
                </button>
                <button className="btn btn-secondary btn-small">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h3 className="empty-state__title">Your Wishlist is Empty</h3>
          <p className="empty-state__message">
            Save items you love to your wishlist and shop them later.
          </p>
        </div>
      )}
    </div>
  );
};

// Prescription Tab Component
const PrescriptionTab = ({ prescription }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="prescription-tab">
      <div className="prescription-tab__header">
        <h2 className="prescription-tab__title">Eye Prescription</h2>
        <p className="prescription-tab__subtitle">
          Your current prescription details
        </p>
      </div>

      {prescription ? (
        <div className="prescription-content">
          <div className="prescription-card">
            <div className="prescription-card__header">
              <h3>Current Prescription</h3>
              <span className="prescription-date">
                Last updated: {formatDate(prescription.lastUpdated)}
              </span>
            </div>
            
            <div className="prescription-details">
              <div className="eye-prescription">
                <h4>Right Eye (OD)</h4>
                <div className="prescription-values">
                  <div className="prescription-value">
                    <span className="label">Sphere (SPH):</span>
                    <span className="value">{prescription.rightEye.sphere}</span>
                  </div>
                  <div className="prescription-value">
                    <span className="label">Cylinder (CYL):</span>
                    <span className="value">{prescription.rightEye.cylinder}</span>
                  </div>
                  <div className="prescription-value">
                    <span className="label">Axis:</span>
                    <span className="value">{prescription.rightEye.axis}°</span>
                  </div>
                </div>
              </div>
              
              <div className="eye-prescription">
                <h4>Left Eye (OS)</h4>
                <div className="prescription-values">
                  <div className="prescription-value">
                    <span className="label">Sphere (SPH):</span>
                    <span className="value">{prescription.leftEye.sphere}</span>
                  </div>
                  <div className="prescription-value">
                    <span className="label">Cylinder (CYL):</span>
                    <span className="value">{prescription.leftEye.cylinder}</span>
                  </div>
                  <div className="prescription-value">
                    <span className="label">Axis:</span>
                    <span className="value">{prescription.leftEye.axis}°</span>
                  </div>
                </div>
              </div>
              
              <div className="additional-details">
                <div className="prescription-value">
                  <span className="label">Pupillary Distance (PD):</span>
                  <span className="value">{prescription.pd}mm</span>
                </div>
              </div>
            </div>
            
            <div className="prescription-actions">
              <button className="btn btn-primary btn-medium">
                Update Prescription
              </button>
              <button className="btn btn-secondary btn-medium">
                Download Prescription
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
            </svg>
          </div>
          <h3 className="empty-state__title">No Prescription Available</h3>
          <p className="empty-state__message">
            Add your eye prescription to get personalized recommendations.
          </p>
          <button className="btn btn-primary btn-medium">
            Add Prescription
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;