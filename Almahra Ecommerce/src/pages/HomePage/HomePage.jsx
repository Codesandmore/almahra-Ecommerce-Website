import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-banner__content">
          <button className="hero-banner__nav hero-banner__nav--left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <div className="hero-banner__main">
            <div className="hero-banner__placeholder">
              Hero Banner Content
            </div>
          </div>
          <button className="hero-banner__nav hero-banner__nav--right">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="category-card">
                <div className="category-card__content">
                  Category {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mixed Product Grid */}
      <section className="mixed-products-section">
        <div className="container">
          <div className="mixed-products-grid">
            {/* Left side - 4 small products */}
            <div className="small-products-grid">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="small-product-card">
                  <div className="product-placeholder">
                    Product {item}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right side - 1 large featured product */}
            <div className="featured-product-card">
              <div className="product-placeholder product-placeholder--large">
                Featured Product
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner 1 */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-banner__content">
            Call to Action Banner
          </div>
        </div>
      </section>

      {/* Product Showcase Row */}
      <section className="product-showcase">
        <div className="container">
          <div className="product-showcase__grid">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="showcase-product-card">
                <div className="product-placeholder">
                  Product {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner 2 */}
      <section className="cta-banner cta-banner--secondary">
        <div className="container">
          <div className="cta-banner__content">
            Secondary CTA Banner
          </div>
        </div>
      </section>

      {/* Large Products Grid */}
      <section className="large-products-section">
        <div className="container">
          <div className="large-products-grid">
            {[1, 2].map((item) => (
              <div key={item} className="large-product-card">
                <div className="product-placeholder product-placeholder--large">
                  Large Product {item}
                </div>
              </div>
            ))}
            
            {/* Right column with 2 stacked products */}
            <div className="stacked-products">
              <div className="large-product-card large-product-card--half">
                <div className="product-placeholder">
                  Product 3
                </div>
              </div>
              <div className="large-product-card large-product-card--half">
                <div className="product-placeholder">
                  Product 4
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="cta-banner cta-banner--final">
        <div className="container">
          <div className="cta-banner__content">
            Final Call to Action
          </div>
        </div>
      </section>

      {/* Footer Content Grid */}
      <section className="footer-content">
        <div className="container">
          <div className="footer-content__grid">
            {/* Left large block */}
            <div className="footer-content__block footer-content__block--large">
              <div className="footer-placeholder">
                Main Footer Content
              </div>
            </div>
            
            {/* Right side with stacked blocks */}
            <div className="footer-content__right">
              <div className="footer-content__block footer-content__block--small">
                <div className="footer-placeholder">
                  Footer Block 1
                </div>
              </div>
              <div className="footer-content__block footer-content__block--small">
                <div className="footer-placeholder">
                  Footer Block 2
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
