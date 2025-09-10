import React, { useState } from 'react';
import Button from '../../common/Button/Button.jsx';
import './UserManagement.css';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
      status: 'active',
      joinDate: '2025-01-15',
      totalOrders: 12,
      totalSpent: 45000,
      avatar: 'J'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'customer',
      status: 'active',
      joinDate: '2025-02-20',
      totalOrders: 8,
      totalSpent: 32000,
      avatar: 'J'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'customer',
      status: 'inactive',
      joinDate: '2025-03-10',
      totalOrders: 3,
      totalSpent: 15000,
      avatar: 'M'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'admin',
      status: 'active',
      joinDate: '2024-12-01',
      totalOrders: 0,
      totalSpent: 0,
      avatar: 'S'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david@example.com',
      role: 'customer',
      status: 'active',
      joinDate: '2025-04-05',
      totalOrders: 15,
      totalSpent: 67000,
      avatar: 'D'
    }
  ];

  const roles = [
    { id: 'all', name: 'All Roles' },
    { id: 'customer', name: 'Customers' },
    { id: 'admin', name: 'Admins' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
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
        {filteredUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-card__header">
              <div className="user-avatar">
                {user.avatar}
              </div>
              <div className="user-card__badges">
                <span className={`role-badge ${getRoleClass(user.role)}`}>
                  {user.role}
                </span>
                <span className={`status-badge ${getStatusClass(user.status)}`}>
                  {user.status}
                </span>
              </div>
            </div>

            <div className="user-card__content">
              <h3 className="user-card__name">{user.name}</h3>
              <p className="user-card__email">{user.email}</p>
              <p className="user-card__join-date">
                Joined: {new Date(user.joinDate).toLocaleDateString()}
              </p>

              {user.role === 'customer' && (
                <div className="user-card__stats">
                  <div className="user-stat-item">
                    <span className="stat-value">{user.totalOrders}</span>
                    <span className="stat-label">Orders</span>
                  </div>
                  <div className="user-stat-item">
                    <span className="stat-value">₹{user.totalSpent.toLocaleString()}</span>
                    <span className="stat-label">Total Spent</span>
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
        ))}
      </div>

      {filteredUsers.length === 0 && (
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
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
