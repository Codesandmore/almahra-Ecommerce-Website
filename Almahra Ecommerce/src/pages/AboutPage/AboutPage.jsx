import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const services = [
    {
      id: 1,
      icon: '👁️',
      title: 'Eye Checkup',
      description: 'Comprehensive eye examinations using the latest technology to ensure optimal eye health and accurate prescriptions.'
    },
    {
      id: 2,
      icon: '👓',
      title: 'Eye Glasses',
      description: 'Wide range of prescription eyeglasses combining style, comfort, and functionality to suit your unique taste and lifestyle.'
    },
    {
      id: 3,
      icon: '🕶️',
      title: 'Sun Glasses',
      description: 'Premium collection of sunglasses offering superior UV protection and fashionable designs for every occasion.'
    }
  ];

  const branches = [
    {
      id: 'al-munthaza',
      name: 'Al Munthaza Branch',
      address: 'Al Munthaza, Doha, Qatar',
      phone: '+974 3033 2307',
      mapLink: 'https://g.co/kgs/KzssCy'
    },
    {
      id: 'al-wukair',
      name: 'Al Wukair Branch',
      address: 'Al Wukair, Qatar',
      phone: '+974 7111 2307',
      mapLink: 'https://g.co/kgs/ijW1MLa'
    },
    {
      id: 'al-sadd',
      name: 'Al Sadd Branch',
      address: 'Al Sadd, Qatar',
      phone: '+974 7118 2307',
      mapLink: 'https://share.google/VCNjkVKBV3vCTJrgc'
    },
    {
      id: 'al-khor',
      name: 'Al Khor Branch',
      address: 'Al Khor, Qatar',
      phone: '+974 7778 2307',
      mapLink: 'https://g.co/kgs/nrf71fy'
    },
    {
      id: 'duhail',
      name: 'Duhail Branch',
      address: 'Duhail, Qatar',
      phone: '+974 7732 2307',
      mapLink: 'https://g.co/kgs/BJaGsJA'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="container">
          <h1 className="about-hero__title">Who We Are?</h1>
          <p className="about-hero__tagline">
            WE PRESERVE, ENHANCE, AND PROTECT YOUR VISION
          </p>
        </div>
      </div>

      <div className="container">
        {/* Introduction */}
        <section className="about-intro">
          <div className="about-intro__content">
            <p className="about-intro__text">
              At <strong>Al Mahra Opticals</strong>, we are committed to providing exceptional 
              eyewear solutions and unparalleled customer service. We have been serving our 
              customers since 2023 and we have established ourselves as a trusted and reputable 
              optical store, dedicated to meeting the diverse needs of our valued customers.
            </p>
          </div>
        </section>

        {/* Our Vision */}
        <section className="about-vision">
          <div className="section-header">
            <h2>Our Vision</h2>
            <div className="section-divider"></div>
          </div>
          <div className="about-vision__content">
            <div className="vision-icon">👁️‍🗨️</div>
            <p>
              We believe in the power of vision and its impact on our lives. Our vision is to be 
              the premier destination for all your eyewear needs, offering a wide range of 
              high-quality products, cutting-edge technology, and personalized services.
            </p>
          </div>
        </section>

        {/* Product Range */}
        <section className="about-products">
          <div className="section-header">
            <h2>Product Range</h2>
            <div className="section-divider"></div>
          </div>
          <div className="about-products__content">
            <p className="about-products__intro">
              Discover a vast collection of eyewear options that combine style, comfort, and 
              functionality. From trendy and fashion-forward frames to classic and timeless 
              designs, we curate a diverse selection to cater to every individual's unique taste 
              and preference.
            </p>
            <div className="product-features">
              <div className="product-feature">
                <span className="feature-icon">✓</span>
                <span>Eyeglasses for every style and prescription</span>
              </div>
              <div className="product-feature">
                <span className="feature-icon">✓</span>
                <span>Premium sunglasses with UV protection</span>
              </div>
              <div className="product-feature">
                <span className="feature-icon">✓</span>
                <span>Contact lenses from trusted brands</span>
              </div>
              <div className="product-feature">
                <span className="feature-icon">✓</span>
                <span>Accessories and eyewear care products</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="about-services">
          <div className="section-header">
            <h2>The Services We Provide</h2>
            <div className="section-divider"></div>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-card__icon">{service.icon}</div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Expert Opticians */}
        <section className="about-team">
          <div className="section-header">
            <h2>Expert Opticians</h2>
            <div className="section-divider"></div>
          </div>
          <div className="about-team__content">
            <div className="team-image">
              <div className="team-icon">👨‍⚕️👩‍⚕️</div>
            </div>
            <div className="team-text">
              <p>
                Our team of experienced and knowledgeable opticians is dedicated to helping you 
                achieve optimal vision and eye health. They are well-versed in the latest 
                advancements in eyewear technology and will guide you through the selection process, 
                taking into consideration your prescription, face shape, and personal style.
              </p>
              <p>
                We prioritize your satisfaction and strive to provide personalized recommendations 
                to enhance your visual experience.
              </p>
            </div>
          </div>
        </section>

        {/* Visit Us */}
        <section className="about-visit">
          <div className="section-header">
            <h2>Visit Us</h2>
            <div className="section-divider"></div>
          </div>
          <div className="about-visit__intro">
            <p>
              Conveniently located across Qatar, we invite you to visit any of our branches and 
              experience the Al Mahra Opticals difference. Discover a world of eyewear possibilities, 
              expert guidance, and exceptional service that will exceed your expectations.
            </p>
            <p className="highlight-text">
              <strong>Your vision is our priority, and we look forward to serving you at Al Mahra Opticals!</strong>
            </p>
          </div>

          {/* Branches */}
          <div className="branches-grid">
            {branches.map((branch) => (
              <div key={branch.id} className="branch-card">
                <h3 className="branch-card__name">{branch.name}</h3>
                <div className="branch-card__details">
                  <div className="branch-detail">
                    <span className="detail-icon">📍</span>
                    <span>{branch.address}</span>
                  </div>
                  <div className="branch-detail">
                    <span className="detail-icon">📞</span>
                    <a href={`tel:${branch.phone}`}>{branch.phone}</a>
                  </div>
                  <a 
                    href={branch.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="branch-map-link"
                  >
                    📍 View on Google Maps →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="about-cta">
          <div className="cta-content">
            <h2>Ready to Experience Excellence in Eye Care?</h2>
            <p>Book your free eye checkup today or browse our collection online</p>
            <div className="cta-buttons">
              <a href="/appointment" className="cta-btn cta-btn--primary">
                Book Appointment
              </a>
              <a href="/products" className="cta-btn cta-btn--secondary">
                Browse Products
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
