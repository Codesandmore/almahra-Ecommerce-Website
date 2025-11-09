import React, { useState, useEffect } from 'react';
import Button from '../../common/Button/Button.jsx';
import adminService from '../../../services/adminService.js';
import './UserManagement.css';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await adminService.getAllUsers();
        setUsers(response.users || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        // Only show error for server errors, not empty data
        if (err.response && err.response.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(null);
        }
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const roles = [
    { id: 'all', name: 'All Roles' },
    { id: 'customer', name: 'Customers' },
    { id: 'admin', name: 'Admins' }
  ];

  const filteredUsers = users.filter(user => {
    const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role?.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const getStatusClass = (status) => {
    return status === 'active' ? 'status--success' : 'status--danger';
  };

  const getRoleClass = (role) => {
    return role === 'admin' ? 'role--admin' : 'role--customer';
  };

  const handleEditUser = (userId) => {
    console.log('Edit user:', userId);
  };

  const handleDeleteUser = (userId) => {
    console.log('Delete user:', userId);
  };

  const handleToggleStatus = (userId) => {
    console.log('Toggle status for user:', userId);
  };

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-management">
        <div className="error-state">
          <h2>Error Loading Users</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management__header">
        <h1 className="user-management__title">User Management</h1>
        <div className="user-stats">
          <div className="user-stat">
            <span className="user-stat__value">{users.filter(u => u.status === 'active').length}</span>
            <span className="user-stat__label">Active Users</span>
          </div>
          <div className="user-stat">
            <span className="user-stat__value">{users.filter(u => u.role === 'customer').length}</span>
            <span className="user-stat__label">Customers</span>
          </div>
          <div className="user-stat">
            <span className="user-stat__value">{users.filter(u => u.role === 'admin').length}</span>
            <span className="user-stat__label">Admins</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="user-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="role-select"
        >
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {/* Users Grid */}
      <div className="users-grid">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-card__header">
              <div className="user-avatar">
                {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="user-card__badges">
                <span className={`role-badge ${getRoleClass(user.role)}`}>
                  {user.role}
                </span>
                <span className={`status-badge ${getStatusClass(user.isVerified ? 'active' : 'inactive')}`}>
                  {user.isVerified ? 'verified' : 'unverified'}
                </span>
              </div>
            </div>

            <div className="user-card__content">
              <h3 className="user-card__name">{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}</h3>
              <p className="user-card__email">{user.email}</p>
              <p className="user-card__join-date">
                Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </p>

              {user.role === 'CUSTOMER' && (
                <div className="user-card__stats">
                  <div className="user-stat-item">
                    <span className="stat-value">{user.totalOrders || 0}</span>
                    <span className="stat-label">Orders</span>
                  </div>
                  <div className="user-stat-item">
                    <span className="stat-value">₹{user.totalSpent?.toLocaleString() || 0}</span>
                    <span className="stat-label">Spent</span>
                  </div>
                </div>
              )}
            </div>

            <div className="user-card__actions">
              <Button 
                variant="secondary"
                size="small"
                onClick={() => handleEditUser(user.id)}
              >
                Edit
              </Button>
              <Button 
                variant={user.status === 'active' ? 'secondary' : 'primary'}
                size="small"
                onClick={() => handleToggleStatus(user.id)}
                className={user.status === 'active' ? 'btn--warning' : 'btn--success'}
              >
                {user.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
              <Button 
                variant="secondary"
                size="small"
                onClick={() => handleDeleteUser(user.id)}
                className="btn--danger"
              >
                Delete
              </Button>
            </div>
          </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="empty-state__title">No users found</h3>
            <p className="empty-state__message">
              {users.length === 0 
                ? "No users have registered yet. Users will appear here once they sign up." 
                : "Try adjusting your search terms or filters to find what you're looking for."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
