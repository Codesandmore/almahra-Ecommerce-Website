import React, { useState } from 'react';
import { products, frameTypes, frameShapes, materials } from '../../../data/mockData.js';
import './ProductManagement.css';

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFrameType, setSelectedFrameType] = useState('all');
  const [selectedFrameShape, setSelectedFrameShape] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Helper function to calculate total stock from variants
  const getTotalStock = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return 0;
    }
    return product.variants.reduce((total, variant) => total + variant.stock, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFrameType = selectedFrameType === 'all' || product.frameType === selectedFrameType;
    const matchesFrameShape = selectedFrameShape === 'all' || product.frameShape === selectedFrameShape;
    const matchesMaterial = selectedMaterial === 'all' || product.material === selectedMaterial;
    
    return matchesSearch && matchesFrameType && matchesFrameShape && matchesMaterial;
  });

  const handleEdit = (productId) => {
    console.log('Edit product:', productId);
  };

  const handleDelete = (productId) => {
    console.log('Delete product:', productId);
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  return (
    <div className="product-management">
      <div className="product-management__header">
        <h1 className="product-management__title">Product Management</h1>
        <button 
          className="btn btn--primary btn--compact"
          onClick={handleAddProduct}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="product-filters">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={selectedFrameType}
          onChange={(e) => setSelectedFrameType(e.target.value)}
          className="category-select"
        >
          <option value="all">All Frame Types</option>
          {frameTypes.map(frameType => (
            <option key={frameType.id} value={frameType.id}>
              {frameType.name}
            </option>
          ))}
        </select>

        <select
          value={selectedFrameShape}
          onChange={(e) => setSelectedFrameShape(e.target.value)}
          className="category-select"
        >
          <option value="all">All Frame Shapes</option>
          {frameShapes.map(frameShape => (
            <option key={frameShape.id} value={frameShape.id}>
              {frameShape.name}
            </option>
          ))}
        </select>

        <select
          value={selectedMaterial}
          onChange={(e) => setSelectedMaterial(e.target.value)}
          className="category-select"
        >
          <option value="all">All Materials</option>
          {materials.map(material => (
            <option key={material.id} value={material.id}>
              {material.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-card__image">
              <img src={product.image} alt={product.name} />
              <div className="product-card__overlay">
                <button 
                  className="btn btn--secondary btn--sm"
                  onClick={() => handleEdit(product.id)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn--danger btn--sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="product-card__content">
              <h3 className="product-card__name">{product.name}</h3>
              <p className="product-card__brand">{product.brand}</p>
              <div className="product-card__details">
                <span className="product-card__price">₹{product.price}</span>
                <span className="product-card__category">{product.category}</span>
              </div>
              <div className="product-card__stock">
                {(() => {
                  const totalStock = getTotalStock(product);
                  const isInStock = totalStock > 0;
                  return (
                    <span className={`stock-indicator ${isInStock ? 'stock-indicator--in-stock' : 'stock-indicator--out-of-stock'}`}>
                      {isInStock ? (
                        <>
                          <span className="stock-count">{totalStock}</span>
                          <span className="stock-text">in stock</span>
                        </>
                      ) : (
                        'Out of Stock'
                      )}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m7.5 4.27 9 5.15"></path>
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <path d="m3.3 7 8.7 5 8.7-5"></path>
              <path d="M12 22V12"></path>
            </svg>
          </div>
          <h3 className="empty-state__title">No products found</h3>
          <p className="empty-state__message">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Add New Product</h2>
              <button 
                className="modal__close"
                onClick={() => setShowAddModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal__content">
              <form className="product-form">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input type="text" className="form-input" placeholder="Enter product name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input type="text" className="form-input" placeholder="Enter brand name" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input type="number" className="form-input" placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select">
                      <option value="">Select category</option>
                      <option value="Sunglasses">Sunglasses</option>
                      <option value="Prescription Glasses">Prescription Glasses</option>
                      <option value="Reading Glasses">Reading Glasses</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Frame Type</label>
                    <select className="form-select">
                      <option value="">Select frame type</option>
                      {frameTypes.map(frameType => (
                        <option key={frameType.id} value={frameType.id}>
                          {frameType.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Frame Shape</label>
                    <select className="form-select">
                      <option value="">Select frame shape</option>
                      {frameShapes.map(frameShape => (
                        <option key={frameShape.id} value={frameShape.id}>
                          {frameShape.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Material</label>
                  <select className="form-select">
                    <option value="">Select material</option>
                    {materials.map(material => (
                      <option key={material.id} value={material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows="4" placeholder="Enter product description"></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Product Image</label>
                  <input type="file" className="form-input" accept="image/*" />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn--secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--primary">
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
