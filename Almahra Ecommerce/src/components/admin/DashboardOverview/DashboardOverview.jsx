import React from 'react';
import './DashboardOverview.css';

const DashboardOverview = () => {
  const stats = [
    {
      title: 'Total Sales',
      value: '₹1,25,840',
      change: '+12.5%',
      trend: 'up',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
    {
      title: 'Orders',
      value: '2,184',
      change: '+8.2%',
      trend: 'up',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
      )
    },
    {
      title: 'Products',
      value: '342',
      change: '+3.1%',
      trend: 'up',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="m7.5 4.27 9 5.15"></path>
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
          <path d="m3.3 7 8.7 5 8.7-5"></path>
          <path d="M12 22V12"></path>
        </svg>
      )
    },
    {
      title: 'Customers',
      value: '1,892',
      change: '+15.3%',
      trend: 'up',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    }
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'John Doe',
      product: 'Ray-Ban Aviator',
      amount: '₹8,500',
      status: 'pending',
      date: '2025-09-11'
    },
    {
      id: '#ORD-002',
      customer: 'Jane Smith',
      product: 'Oakley Holbrook',
      amount: '₹12,000',
      status: 'completed',
      date: '2025-09-11'
    },
    {
      id: '#ORD-003',
      customer: 'Mike Johnson',
      product: 'Maui Jim Peahi',
      amount: '₹15,500',
      status: 'processing',
      date: '2025-09-10'
    },
    {
      id: '#ORD-004',
      customer: 'Sarah Wilson',
      product: 'Persol PO3019S',
      amount: '₹9,800',
      status: 'completed',
      date: '2025-09-10'
    }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status--success';
      case 'processing':
        return 'status--warning';
      case 'pending':
        return 'status--pending';
      default:
        return '';
    }
  };

  return (
    <div className="dashboard-overview">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card__header">
              <div className="stat-card__icon">
                {stat.icon}
              </div>
              <div className={`stat-card__change ${stat.trend === 'up' ? 'stat-card__change--positive' : 'stat-card__change--negative'}`}>
                {stat.change}
              </div>
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__value">{stat.value}</h3>
              <p className="stat-card__title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="dashboard-content-grid">
        {/* Recent Orders */}
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">Recent Orders</h2>
            <button className="dashboard-card__action">View All</button>
          </div>
          <div className="dashboard-card__content">
            <div className="orders-table">
              <div className="orders-table__header">
                <div className="orders-table__cell">Order ID</div>
                <div className="orders-table__cell">Customer</div>
                <div className="orders-table__cell">Product</div>
                <div className="orders-table__cell">Amount</div>
                <div className="orders-table__cell">Status</div>
              </div>
              {recentOrders.map((order) => (
                <div key={order.id} className="orders-table__row">
                  <div className="orders-table__cell orders-table__cell--id">{order.id}</div>
                  <div className="orders-table__cell">{order.customer}</div>
                  <div className="orders-table__cell">{order.product}</div>
                  <div className="orders-table__cell orders-table__cell--amount">{order.amount}</div>
                  <div className="orders-table__cell">
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">Quick Actions</h2>
          </div>
          <div className="dashboard-card__content">
            <div className="quick-actions">
              <button className="quick-action">
                <div className="quick-action__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
                <span>Add Product</span>
              </button>
              <button className="quick-action">
                <div className="quick-action__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <span>View Customers</span>
              </button>
              <button className="quick-action">
                <div className="quick-action__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                  </svg>
                </div>
                <span>View Analytics</span>
              </button>
              <button className="quick-action">
                <div className="quick-action__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                    <circle cx="12" cy="13" r="3"></circle>
                  </svg>
                </div>
                <span>Manage Inventory</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
