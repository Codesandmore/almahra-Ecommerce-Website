import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      // Check if login was successful
      if (!result.success) {
        setError(result.error || 'Invalid email or password');
        setLoading(false);
        return;
      }
      
      // Check if user is admin
      if (result.user.role !== 'ADMIN' && result.user.role !== 'SUPER_ADMIN') {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          {/* Admin Badge */}
          <div className="admin-badge">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>

          {/* Header */}
          <div className="admin-login-header">
            <h1>Admin Portal</h1>
            <p>Sign in to access the admin dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="admin-error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@almahra.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="admin-login-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="admin-login-footer">
            <Link to="/login" className="back-to-user-login">
              ← Back to Customer Login
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="admin-info-box">
          <h3>Admin Access Only</h3>
          <p>This portal is restricted to authorized administrators only.</p>
          <ul>
            <li>✓ Manage products and inventory</li>
            <li>✓ Process orders and shipments</li>
            <li>✓ View analytics and reports</li>
            <li>✓ Manage users and permissions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
