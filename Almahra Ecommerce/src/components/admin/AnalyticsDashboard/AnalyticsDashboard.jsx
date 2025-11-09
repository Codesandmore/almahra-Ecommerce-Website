import React, { useState, useEffect } from 'react';
import adminService from '../../../services/adminService.js';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    revenue: { current: 0, previous: 0, change: 0 },
    orders: { current: 0, previous: 0, change: 0 },
    customers: { current: 0, previous: 0, change: 0 },
    conversionRate: { current: 0, previous: 0, change: 0 }
  });
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);

  const periods = [
    { id: '7days', label: 'Last 7 Days' },
    { id: '30days', label: 'Last 30 Days' },
    { id: '90days', label: 'Last 3 Months' },
    { id: '1year', label: 'Last Year' }
  ];

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboard();
        
        if (response.metrics) {
          // Map backend metrics to analytics format
          setAnalyticsData({
            revenue: {
              current: response.metrics.total_revenue || 0,
              previous: response.metrics.previous_revenue || 0,
              change: response.metrics.revenue_change || 0
            },
            orders: {
              current: response.metrics.total_orders || 0,
              previous: response.metrics.previous_orders || 0,
              change: response.metrics.orders_change || 0
            },
            customers: {
              current: response.metrics.total_customers || 0,
              previous: response.metrics.previous_customers || 0,
              change: response.metrics.customers_change || 0
            },
            conversionRate: {
              current: response.metrics.conversion_rate || 0,
              previous: response.metrics.previous_conversion_rate || 0,
              change: response.metrics.conversion_change || 0
            }
          });

          // Set top products if available
          if (response.top_products) {
            setTopProducts(response.top_products);
          }

          // Set sales data if available
          if (response.sales_chart) {
            setSalesData(response.sales_chart);
          }
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedPeriod]);

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

  // Customer metrics (will be populated from API later)
  const customerMetrics = [
    { label: 'New Customers', value: analyticsData.customers.current || 0, change: analyticsData.customers.change || 0, trend: analyticsData.customers.change >= 0 ? 'up' : 'down' },
    { label: 'Total Orders', value: analyticsData.orders.current || 0, change: analyticsData.orders.change || 0, trend: analyticsData.orders.change >= 0 ? 'up' : 'down' },
    { label: 'Total Revenue', value: formatCurrency(analyticsData.revenue.current || 0), change: analyticsData.revenue.change || 0, trend: analyticsData.revenue.change >= 0 ? 'up' : 'down' },
    { label: 'Conversion Rate', value: `${analyticsData.conversionRate.current || 0}%`, change: analyticsData.conversionRate.change || 0, trend: analyticsData.conversionRate.change >= 0 ? 'up' : 'down' }
  ];

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

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading analytics...</p>
        </div>
      ) : (
        <>
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
            {salesData.length > 0 ? (
              <div className="sales-chart">
                {salesData.map((data, index) => {
                  const maxSales = Math.max(...salesData.map(d => d.sales || 0));
                  return (
                    <div key={index} className="sales-chart__item">
                      <div 
                        className="sales-chart__bar"
                        style={{ height: `${maxSales > 0 ? (data.sales / maxSales) * 100 : 0}%` }}
                      />
                      <div className="sales-chart__value">
                        {formatCurrency(data.sales || 0)}
                      </div>
                      <div className="sales-chart__label">{data.day || data.label}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                <p>No sales data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="analytics-card">
          <div className="analytics-card__header">
            <h2 className="analytics-card__title">Top Products</h2>
          </div>
          <div className="analytics-card__content">
            {topProducts.length > 0 ? (
              <div className="top-products">
                {topProducts.map((product, index) => {
                  const maxRevenue = Math.max(...topProducts.map(p => p.revenue || 0));
                  return (
                    <div key={index} className="product-item">
                      <div className="product-item__rank">#{index + 1}</div>
                      <div className="product-item__details">
                        <div className="product-item__name">{product.name}</div>
                        <div className="product-item__stats">
                          {product.sales || 0} sales • {formatCurrency(product.revenue || 0)}
                        </div>
                      </div>
                      <div className="product-item__progress">
                        <div 
                          className="product-item__progress-bar"
                          style={{ width: `${maxRevenue > 0 ? (product.revenue / maxRevenue) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                <p>No product data available yet</p>
              </div>
            )}
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
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
