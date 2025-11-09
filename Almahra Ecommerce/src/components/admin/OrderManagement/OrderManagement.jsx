import React, { useState, useMemo, useEffect } from 'react';
import orderService from '../../../services/orderService.js';
import './OrderManagement.css';

const OrderManagement = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' for ascending, 'desc' for descending
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getAllOrders();
        setOrders(response.orders || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        // Only show error for server errors, not empty data
        if (err.response && err.response.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(null);
        }
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  // Filter and sort orders with useMemo for performance
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = selectedTab === 'all' 
      ? orders 
      : orders.filter(order => order.status === selectedTab);
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(order => 
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date sorting
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  }, [orders, selectedTab, searchTerm, sortOrder]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status--success';
      case 'processing':
        return 'status--warning';
      case 'pending':
        return 'status--pending';
      case 'cancelled':
        return 'status--danger';
      default:
        return '';
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  const handleViewOrder = (orderId) => {
    console.log(`Viewing order ${orderId}`);
  };

  if (loading) {
    return (
      <div className="order-management">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-management">
        <div className="error-state">
          <h2>Error Loading Orders</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="order-management__header">
        <h1 className="order-management__title">Order Management</h1>
        <div className="order-stats">
          <div className="order-stat">
            <span className="order-stat__value">₹1,25,840</span>
            <span className="order-stat__label">Total Revenue</span>
          </div>
          <div className="order-stat">
            <span className="order-stat__value">{orders.length}</span>
            <span className="order-stat__label">Total Orders</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="order-controls">
        <div className="search-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by customer name, email or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="search-clear"
                title="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          
          <div className="sort-controls">
            <label className="sort-label">Sort by date:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-select"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Order Tabs */}
      <div className="order-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`order-tab ${selectedTab === tab.id ? 'order-tab--active' : ''}`}
            data-tab={tab.id}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
            <span className="order-tab__count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="orders-container">
        {filteredAndSortedOrders.length > 0 && (
          <div className="orders-summary">
            Showing {filteredAndSortedOrders.length} of {orders.length} orders
            {searchTerm && <span className="search-results"> for "{searchTerm}"</span>}
          </div>
        )}
        
        {filteredAndSortedOrders.length > 0 ? (
          filteredAndSortedOrders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card__header">
              <div className="order-card__id">
                <strong>{order.id}</strong>
                <span className="order-card__date">{order.date}</span>
              </div>
              <div className="order-card__status">
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="order-card__content">
              <div className="order-card__customer">
                <h3 className="customer-name">{order.customer}</h3>
                <p className="customer-email">{order.email}</p>
                <p className="customer-address">{order.address}</p>
              </div>

              <div className="order-card__products">
                <div className="products-title">Products:</div>
                <ul className="products-list">
                  {order.products.map((product, index) => (
                    <li key={index} className="product-item">{product}</li>
                  ))}
                </ul>
              </div>

              <div className="order-card__total">
                <span className="total-label">Total:</span>
                <span className="total-amount">₹{order.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="order-card__actions">
              <button 
                onClick={() => handleViewOrder(order.id)}
                className="order-view-details-btn btn btn--primary btn--sm"
              >
                View Details
              </button>
              
              <select
                className="status-select"
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </div>
            <h3 className="empty-state__title">No orders found</h3>
            <p className="empty-state__message">
              {orders.length === 0 
                ? "No orders have been placed yet. Orders will appear here once customers make purchases." 
                : "No orders match the current filter criteria. Try adjusting your search or filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;