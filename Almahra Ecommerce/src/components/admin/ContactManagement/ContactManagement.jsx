import React, { useState, useEffect } from 'react';
import './ContactManagement.css';

const ContactManagement = () => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = () => {
    const savedQueries = JSON.parse(localStorage.getItem('contactQueries') || '[]');
    // Sort by most recent first
    const sortedQueries = savedQueries.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    setQueries(sortedQueries);
  };

  const updateQueryStatus = (queryId, newStatus) => {
    const updatedQueries = queries.map(query => 
      query.id === queryId ? { ...query, status: newStatus } : query
    );
    setQueries(updatedQueries);
    localStorage.setItem('contactQueries', JSON.stringify(updatedQueries));
    
    if (selectedQuery?.id === queryId) {
      setSelectedQuery({ ...selectedQuery, status: newStatus });
    }
  };

  const deleteQuery = (queryId) => {
    if (confirm('Are you sure you want to delete this query?')) {
      const updatedQueries = queries.filter(query => query.id !== queryId);
      setQueries(updatedQueries);
      localStorage.setItem('contactQueries', JSON.stringify(updatedQueries));
      
      if (selectedQuery?.id === queryId) {
        setSelectedQuery(null);
      }
    }
  };

  const getFilteredQueries = () => {
    let filtered = queries;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(query => query.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(query => 
        query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusCount = (status) => {
    if (status === 'all') return queries.length;
    return queries.filter(query => query.status === status).length;
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'status-badge--pending';
      case 'in-progress': return 'status-badge--progress';
      case 'resolved': return 'status-badge--resolved';
      default: return 'status-badge--pending';
    }
  };

  const filteredQueries = getFilteredQueries();

  return (
    <div className="contact-management">
      <div className="contact-management__header">
        <h1>Contact Queries</h1>
        <p>Manage and respond to customer inquiries</p>
      </div>

      {/* Filters */}
      <div className="contact-management__filters">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${statusFilter === 'all' ? 'filter-tab--active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({getStatusCount('all')})
          </button>
          <button 
            className={`filter-tab ${statusFilter === 'pending' ? 'filter-tab--active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({getStatusCount('pending')})
          </button>
          <button 
            className={`filter-tab ${statusFilter === 'in-progress' ? 'filter-tab--active' : ''}`}
            onClick={() => setStatusFilter('in-progress')}
          >
            In Progress ({getStatusCount('in-progress')})
          </button>
          <button 
            className={`filter-tab ${statusFilter === 'resolved' ? 'filter-tab--active' : ''}`}
            onClick={() => setStatusFilter('resolved')}
          >
            Resolved ({getStatusCount('resolved')})
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Content */}
      <div className="contact-management__content">
        {/* Query List */}
        <div className="queries-list">
          {filteredQueries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No queries found</h3>
              <p>
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'No contact queries received yet'}
              </p>
            </div>
          ) : (
            filteredQueries.map(query => (
              <div 
                key={query.id} 
                className={`query-card ${selectedQuery?.id === query.id ? 'query-card--active' : ''}`}
                onClick={() => setSelectedQuery(query)}
              >
                <div className="query-card__header">
                  <div className="query-card__info">
                    <h3>{query.name}</h3>
                    <span className={`status-badge ${getStatusBadgeClass(query.status)}`}>
                      {query.status.replace('-', ' ')}
                    </span>
                  </div>
                  <span className="query-card__date">
                    {new Date(query.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="query-card__subject">
                  <strong>{query.subject}</strong>
                </div>
                <div className="query-card__message">
                  {query.message.substring(0, 100)}
                  {query.message.length > 100 ? '...' : ''}
                </div>
                <div className="query-card__contact">
                  <span>📧 {query.email}</span>
                  <span>📞 {query.phone}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Query Details */}
        <div className="query-details">
          {selectedQuery ? (
            <>
              <div className="query-details__header">
                <div>
                  <h2>{selectedQuery.name}</h2>
                  <span className={`status-badge ${getStatusBadgeClass(selectedQuery.status)}`}>
                    {selectedQuery.status.replace('-', ' ')}
                  </span>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => deleteQuery(selectedQuery.id)}
                >
                  🗑️ Delete
                </button>
              </div>

              <div className="query-details__content">
                <div className="detail-section">
                  <h3>Contact Information</h3>
                  <div className="detail-row">
                    <strong>Email:</strong>
                    <a href={`mailto:${selectedQuery.email}`}>{selectedQuery.email}</a>
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong>
                    <a href={`tel:${selectedQuery.phone}`}>{selectedQuery.phone}</a>
                  </div>
                  <div className="detail-row">
                    <strong>Submitted:</strong>
                    <span>{new Date(selectedQuery.createdAt).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Subject</h3>
                  <p className="subject-text">{selectedQuery.subject}</p>
                </div>

                <div className="detail-section">
                  <h3>Message</h3>
                  <div className="message-box">
                    {selectedQuery.message}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Update Status</h3>
                  <div className="status-buttons">
                    <button 
                      className={`status-btn status-btn--pending ${selectedQuery.status === 'pending' ? 'status-btn--active' : ''}`}
                      onClick={() => updateQueryStatus(selectedQuery.id, 'pending')}
                    >
                      Pending
                    </button>
                    <button 
                      className={`status-btn status-btn--progress ${selectedQuery.status === 'in-progress' ? 'status-btn--active' : ''}`}
                      onClick={() => updateQueryStatus(selectedQuery.id, 'in-progress')}
                    >
                      In Progress
                    </button>
                    <button 
                      className={`status-btn status-btn--resolved ${selectedQuery.status === 'resolved' ? 'status-btn--active' : ''}`}
                      onClick={() => updateQueryStatus(selectedQuery.id, 'resolved')}
                    >
                      Resolved
                    </button>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Quick Actions</h3>
                  <div className="quick-actions">
                    <a 
                      href={`mailto:${selectedQuery.email}?subject=Re: ${selectedQuery.subject}`}
                      className="action-btn action-btn--primary"
                    >
                      📧 Reply via Email
                    </a>
                    <a 
                      href={`tel:${selectedQuery.phone}`}
                      className="action-btn action-btn--secondary"
                    >
                      📞 Call Customer
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="query-details__empty">
              <div className="empty-icon">👈</div>
              <h3>Select a query</h3>
              <p>Choose a query from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactManagement;
