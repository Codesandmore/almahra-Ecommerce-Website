import React, { useState } from 'react';
import './OrderManagement.css';

const OrderManagement = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Debug: Log component load and CSS
  console.log('OrderManagement component loaded');

  const orders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      products: ['Ray-Ban Aviator', 'Lens Cleaner'],
      total: 8500,
      status: 'pending',
      date: '2025-09-11',
      address: '123 Main St, New Delhi, India'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      products: ['Oakley Holbrook'],
      total: 12000,
      status: 'completed',
      date: '2025-09-11',
      address: '456 Park Ave, Mumbai, India'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      products: ['Maui Jim Peahi', 'Protective Case'],
      total: 15500,
      status: 'processing',
      date: '2025-09-10',
      address: '789 Oak Rd, Bangalore, India'
    },
    {
      id: 'ORD-004',
      customer: 'Sarah Wilson',
      email: 'sarah@example.com',
      products: ['Persol PO3019S'],
      total: 9800,
      status: 'completed',
      date: '2025-09-10',
      address: '321 Pine St, Chennai, India'
    },
    {
      id: 'ORD-005',
      customer: 'David Brown',
      email: 'david@example.com',
      products: ['Tom Ford Henry', 'Blue Light Filter'],
      total: 22000,
      status: 'cancelled',
      date: '2025-09-09',
      address: '654 Elm St, Kolkata, India'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  const filteredOrders = selectedTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedTab);

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
        {filteredOrders.map(order => (
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
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
          </div>
          <h3 className="empty-state__title">No orders found</h3>
          <p className="empty-state__message">
            No orders match the current filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
