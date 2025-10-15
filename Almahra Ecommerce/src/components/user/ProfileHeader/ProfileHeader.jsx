import React from 'react';
import Button from '../../common/Button/Button.jsx';
import './ProfileHeader.css';

const ProfileHeader = ({ user, onEditProfile }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Unknown';
      }
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  return (
    <div className="profile-header">
      <div className="profile-header__content">
        <div className="profile-header__avatar">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={`${user.firstName} ${user.lastName}`}
              className="profile-avatar__image"
            />
          ) : (
            <div className="profile-avatar__placeholder">
              {getInitials(user.firstName, user.lastName)}
            </div>
          )}
        </div>
        
        <div className="profile-header__info">
          <h1 className="profile-header__name">
            {user.firstName} {user.lastName}
          </h1>
          <p className="profile-header__email">{user.email}</p>
          <div className="profile-header__meta">
            <span className="profile-meta__item">
              <svg className="profile-meta__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
              </svg>
              Member since {formatJoinDate(user.createdAt)}
            </span>
          </div>
        </div>
        
        <div className="profile-header__actions">
          <Button 
            variant="secondary" 
            size="medium"
            onClick={onEditProfile}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            }
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;