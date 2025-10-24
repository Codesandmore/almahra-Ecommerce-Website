import React, { useState, useEffect } from 'react';
import emailService from '../../../services/emailService';
import './EmailLog.css';

const EmailLog = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = () => {
    const sentEmails = emailService.getSentEmails();
    setEmails(sentEmails.reverse()); // Show newest first
  };

  const getEmailTypeLabel = (type) => {
    const labels = {
      'order_confirmation': 'Order Confirmation',
      'order_shipped': 'Order Shipped',
      'order_delivered': 'Order Delivered',
      'appointment_confirmation': 'Appointment Confirmation',
      'appointment_reminder': 'Appointment Reminder',
      'appointment_cancellation': 'Appointment Cancelled',
      'welcome': 'Welcome Email',
      'password_reset': 'Password Reset'
    };
    return labels[type] || type;
  };

  const getEmailTypeColor = (type) => {
    const colors = {
      'order_confirmation': 'type-order',
      'order_shipped': 'type-shipping',
      'order_delivered': 'type-delivered',
      'appointment_confirmation': 'type-appointment',
      'appointment_reminder': 'type-reminder',
      'appointment_cancellation': 'type-cancelled',
      'welcome': 'type-welcome',
      'password_reset': 'type-reset'
    };
    return colors[type] || '';
  };

  const filteredEmails = filter === 'all' 
    ? emails 
    : filter === 'password_reset' || filter === 'welcome'
      ? emails.filter(email => email.type === filter)
      : emails.filter(email => email.type.includes(filter));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="email-log">
      <div className="email-log__header">
        <h3>Email Log</h3>
        <p className="email-log__subtitle">
          {emails.length} email{emails.length !== 1 ? 's' : ''} sent
        </p>
      </div>

      <div className="email-log__filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({emails.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'order' ? 'active' : ''}`}
          onClick={() => setFilter('order')}
        >
          Orders ({emails.filter(e => e.type.includes('order')).length})
        </button>
        <button 
          className={`filter-btn ${filter === 'appointment' ? 'active' : ''}`}
          onClick={() => setFilter('appointment')}
        >
          Appointments ({emails.filter(e => e.type.includes('appointment')).length})
        </button>
        <button 
          className={`filter-btn ${filter === 'password_reset' ? 'active' : ''}`}
          onClick={() => setFilter('password_reset')}
        >
          Password Reset ({emails.filter(e => e.type === 'password_reset').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'welcome' ? 'active' : ''}`}
          onClick={() => setFilter('welcome')}
        >
          Welcome ({emails.filter(e => e.type === 'welcome').length})
        </button>
      </div>

      {filteredEmails.length === 0 ? (
        <div className="email-log__empty">
          <div className="empty-icon">📧</div>
          <p>No emails sent yet</p>
        </div>
      ) : (
        <div className="email-log__content">
          <div className="email-list">
            {filteredEmails.map((email, index) => (
              <div 
                key={index} 
                className={`email-item ${selectedEmail === email ? 'email-item--selected' : ''}`}
                onClick={() => setSelectedEmail(email)}
              >
                <div className="email-item__header">
                  <span className={`email-type ${getEmailTypeColor(email.type)}`}>
                    {getEmailTypeLabel(email.type)}
                  </span>
                  <span className="email-date">{formatDate(email.sentAt)}</span>
                </div>
                <div className="email-item__details">
                  <div className="email-to">
                    <strong>To:</strong> {email.to}
                  </div>
                  <div className="email-subject">{email.subject}</div>
                </div>
              </div>
            ))}
          </div>

          {selectedEmail && (
            <div className="email-preview">
              <div className="email-preview__header">
                <h4>Email Preview</h4>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedEmail(null)}
                >
                  ×
                </button>
              </div>
              <div className="email-preview__meta">
                <div><strong>To:</strong> {selectedEmail.to}</div>
                <div><strong>Subject:</strong> {selectedEmail.subject}</div>
                <div><strong>Type:</strong> {getEmailTypeLabel(selectedEmail.type)}</div>
                <div><strong>Sent:</strong> {formatDate(selectedEmail.sentAt)}</div>
              </div>
              <div className="email-preview__body">
                <iframe 
                  srcDoc={selectedEmail.html}
                  title="Email Preview"
                  style={{ width: '100%', height: '600px', border: 'none' }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailLog;