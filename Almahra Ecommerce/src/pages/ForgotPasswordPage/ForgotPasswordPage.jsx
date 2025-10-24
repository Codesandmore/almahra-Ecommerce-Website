import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import emailService from '../../services/emailService.js';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code, 3: Reset password
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    if (message) setMessage('');
  };

  // Step 1: Send verification code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    // Check if email exists
    const users = JSON.parse(localStorage.getItem('almahra_users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());

    if (!user) {
      setErrors({ email: 'No account found with this email address' });
      return;
    }

    setIsLoading(true);

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    // Send email with verification code
    try {
      await emailService.sendPasswordReset(formData.email, code);
      setMessage('Verification code sent to your email!');
      setStep(2);
    } catch (error) {
      setErrors({ email: 'Failed to send verification code. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    if (!formData.code.trim()) {
      setErrors({ code: 'Verification code is required' });
      return;
    }

    if (formData.code !== generatedCode) {
      setErrors({ code: 'Invalid verification code. Please try again.' });
      return;
    }

    setMessage('Code verified! Please enter your new password.');
    setStep(3);
  };

  // Step 3: Reset password
  const handleResetPassword = (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Update password in localStorage
    const users = JSON.parse(localStorage.getItem('almahra_users') || '[]');
    const userIndex = users.findIndex(u => u.email.toLowerCase() === formData.email.toLowerCase());

    if (userIndex !== -1) {
      users[userIndex].password = formData.newPassword;
      localStorage.setItem('almahra_users', JSON.stringify(users));

      setMessage('Password reset successfully! Redirecting to login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      setErrors({ general: 'User not found. Please try again.' });
    }

    setIsLoading(false);
  };

  // Resend code
  const handleResendCode = async () => {
    setIsLoading(true);
    setMessage('');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    try {
      await emailService.sendPasswordReset(formData.email, code);
      setMessage('New verification code sent to your email!');
    } catch (error) {
      setMessage('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <h1>Reset Password</h1>
            <p>
              {step === 1 && 'Enter your email to receive a verification code'}
              {step === 2 && 'Enter the verification code sent to your email'}
              {step === 3 && 'Create a new password for your account'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="reset-progress">
            <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <span>Email</span>
            </div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <span>Verify</span>
            </div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Reset</span>
            </div>
          </div>

          {message && (
            <div className={`message ${step === 3 && message.includes('successfully') ? 'success' : 'info'}`}>
              {message}
            </div>
          )}

          {errors.general && (
            <div className="message error">{errors.general}</div>
          )}

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your registered email"
                  className={errors.email ? 'input-error' : ''}
                  autoFocus
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>

              <div className="form-footer">
                <Link to="/login" className="back-link">← Back to Login</Link>
              </div>
            </form>
          )}

          {/* Step 2: Verify Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="code">Verification Code</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  className={errors.code ? 'input-error' : ''}
                  autoFocus
                />
                {errors.code && <span className="error-message">{errors.code}</span>}
                <p className="help-text">Code sent to: {formData.email}</p>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                Verify Code
              </button>

              <div className="form-footer">
                <button 
                  type="button" 
                  onClick={handleResendCode} 
                  className="resend-link"
                  disabled={isLoading}
                >
                  Didn't receive code? Resend
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="back-link"
                >
                  ← Change Email
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={errors.newPassword ? 'input-error' : ''}
                  autoFocus
                />
                {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={errors.confirmPassword ? 'input-error' : ''}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
