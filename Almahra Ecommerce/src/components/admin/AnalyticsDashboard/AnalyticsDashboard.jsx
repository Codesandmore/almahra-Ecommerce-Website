import React, { useState } from 'react';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  const periods = [
    { id: '7days', label: 'Last 7 Days' },
    { id: '30days', label: 'Last 30 Days' },
    { id: '90days', label: 'Last 3 Months' },
    { id: '1year', label: 'Last Year' }
  ];

  const analyticsData = {
    revenue: {
      current: 125840,
      previous: 112350,
      change: 12.0
    },
    orders: {
      current: 2184,
      previous: 1950,
      change: 12.0
    },
    customers: {
      current: 1892,
      previous: 1645,
      change: 15.0
    },
    conversionRate: {
      current: 3.2,
      previous: 2.8,
      change: 14.3
    }
  };

  const topProducts = [
    { name: 'Ray-Ban Aviator Classic', sales: 156, revenue: 132000 },
    { name: 'Oakley Holbrook', sales: 124, revenue: 148800 },
    { name: 'Maui Jim Peahi', sales: 98, revenue: 151900 },
    { name: 'Persol PO3019S', sales: 87, revenue: 85260 },
    { name: 'Tom Ford Henry', sales: 65, revenue: 143000 }
  ];

  const salesData = [
    { day: 'Mon', sales: 12000 },
    { day: 'Tue', sales: 15000 },
    { day: 'Wed', sales: 8000 },
    { day: 'Thu', sales: 22000 },
    { day: 'Fri', sales: 18000 },
    { day: 'Sat', sales: 25000 },
    { day: 'Sun', sales: 20000 }
  ];

  const maxSales = Math.max(...salesData.map(d => d.sales));

  const customerMetrics = [
    { label: 'New Customers', value: 156, change: 8.2, trend: 'up' },
    { label: 'Returning Customers', value: 324, change: 12.5, trend: 'up' },
    { label: 'Customer Lifetime Value', value: '₹23,540', change: 5.8, trend: 'up' },
    { label: 'Average Order Value', value: '₹8,760', change: -2.1, trend: 'down' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getChangeClass = (change) => {
    return change >= 0 ? 'change--positive' : 'change--negative';
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1 className="analytics-title">Analytics Dashboard</h1>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="period-select"
        >
          {periods.map(period => (
            <option key={period.id} value={period.id}>
              {period.label}
            </option>
          ))}
        </select>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-card__header">
            <h3 className="metric-card__title">Total Revenue</h3>
            <div className={`metric-card__change ${getChangeClass(analyticsData.revenue.change)}`}>
              +{analyticsData.revenue.change}%
            </div>
          </div>
          <div className="metric-card__value">
            {formatCurrency(analyticsData.revenue.current)}
          </div>
          <div className="metric-card__comparison">
            vs {formatCurrency(analyticsData.revenue.previous)} last period
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card__header">
            <h3 className="metric-card__title">Total Orders</h3>
            <div className={`metric-card__change ${getChangeClass(analyticsData.orders.change)}`}>
              +{analyticsData.orders.change}%
            </div>
          </div>
          <div className="metric-card__value">
            {analyticsData.orders.current.toLocaleString()}
          </div>
          <div className="metric-card__comparison">
            vs {analyticsData.orders.previous.toLocaleString()} last period
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card__header">
            <h3 className="metric-card__title">Total Customers</h3>
            <div className={`metric-card__change ${getChangeClass(analyticsData.customers.change)}`}>
              +{analyticsData.customers.change}%
            </div>
          </div>
          <div className="metric-card__value">
            {analyticsData.customers.current.toLocaleString()}
          </div>
          <div className="metric-card__comparison">
            vs {analyticsData.customers.previous.toLocaleString()} last period
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card__header">
            <h3 className="metric-card__title">Conversion Rate</h3>
            <div className={`metric-card__change ${getChangeClass(analyticsData.conversionRate.change)}`}>
              +{analyticsData.conversionRate.change}%
            </div>
          </div>
          <div className="metric-card__value">
            {analyticsData.conversionRate.current}%
          </div>
          <div className="metric-card__comparison">
            vs {analyticsData.conversionRate.previous}% last period
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="analytics-content-grid">
        {/* Sales Chart */}
        <div className="analytics-card">
          <div className="analytics-card__header">
            <h2 className="analytics-card__title">Sales Overview</h2>
          </div>
          <div className="analytics-card__content">
            <div className="sales-chart">
              {salesData.map((data, index) => (
                <div key={index} className="sales-chart__item">
                  <div 
                    className="sales-chart__bar"
                    style={{ height: `${(data.sales / maxSales) * 100}%` }}
                  />
                  <div className="sales-chart__value">
                    {formatCurrency(data.sales)}
                  </div>
                  <div className="sales-chart__label">{data.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="analytics-card">
          <div className="analytics-card__header">
            <h2 className="analytics-card__title">Top Products</h2>
          </div>
          <div className="analytics-card__content">
            <div className="top-products">
              {topProducts.map((product, index) => (
                <div key={index} className="product-item">
                  <div className="product-item__rank">#{index + 1}</div>
                  <div className="product-item__details">
                    <div className="product-item__name">{product.name}</div>
                    <div className="product-item__stats">
                      {product.sales} sales • {formatCurrency(product.revenue)}
                    </div>
                  </div>
                  <div className="product-item__progress">
                    <div 
                      className="product-item__progress-bar"
                      style={{ width: `${(product.revenue / 151900) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="analytics-card analytics-card--full">
          <div className="analytics-card__header">
            <h2 className="analytics-card__title">Customer Metrics</h2>
          </div>
          <div className="analytics-card__content">
            <div className="customer-metrics-grid">
              {customerMetrics.map((metric, index) => (
                <div key={index} className="customer-metric">
                  <div className="customer-metric__header">
                    <span className="customer-metric__label">{metric.label}</span>
                    <span className={`customer-metric__change ${getChangeClass(metric.change)}`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                  <div className="customer-metric__value">{metric.value}</div>
                  <div className="customer-metric__trend">
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      className={`trend-icon trend-icon--${metric.trend}`}
                    >
                      {metric.trend === 'up' ? (
                        <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
                      ) : (
                        <polyline points="1,18 8.5,10.5 13.5,15.5 23,6"></polyline>
                      )}
                    </svg>
                    <span>{metric.trend === 'up' ? 'Trending up' : 'Trending down'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
