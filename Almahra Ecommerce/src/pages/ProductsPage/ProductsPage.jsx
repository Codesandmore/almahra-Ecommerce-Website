import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard/ProductCard.jsx';
import { products, frameTypes, frameShapes, materials } from '../../data/mockData.js';
import './ProductsPage.css';

const ProductsPage = () => {
  const { category: urlCategory } = useParams();
  const [searchParams] = useSearchParams();
  const [selectedFrameType, setSelectedFrameType] = useState('all');
  const [selectedFrameShape, setSelectedFrameShape] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Initialize filters from URL parameters
  useEffect(() => {
    const frameTypeParam = searchParams.get('frameType');
    const frameShapeParam = searchParams.get('frameShape');
    const materialParam = searchParams.get('material');
    
    if (frameTypeParam) setSelectedFrameType(frameTypeParam);
    if (frameShapeParam) setSelectedFrameShape(frameShapeParam);
    if (materialParam) setSelectedMaterial(materialParam);
  }, [urlCategory, searchParams]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const frameTypeMatch = selectedFrameType === 'all' || product.frameType === selectedFrameType;
      const frameShapeMatch = selectedFrameShape === 'all' || product.frameShape === selectedFrameShape;
      const materialMatch = selectedMaterial === 'all' || product.material === selectedMaterial;
      
      return frameTypeMatch && frameShapeMatch && materialMatch;
    });
  }, [selectedFrameType, selectedFrameShape, selectedMaterial]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const clearFilters = () => {
    setSelectedFrameType('all');
    setSelectedFrameShape('all');
    setSelectedMaterial('all');
    setCurrentPage(1);
  };

  return (
    <div className="products-page">
      <div className="products-page__container">
        {/* Left Sidebar */}
        <aside className="products-sidebar">
          <div className="products-sidebar__header">
            <h1 className="products-sidebar__title">Ray Ban Aviators</h1>
          </div>
          
          <div className="filters">
            <div className="filters__header">
              <h3 className="filters__title">Filters</h3>
              <button className="filters__clear" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>

            <div className="filter-group">
              <h4 className="filter-group__title">Frame Type</h4>
              <ul className="filter-list">
                <li className="filter-item">
                  <label className="filter-label">
                    <input
                      type="radio"
                      name="frameType"
                      value="all"
                      checked={selectedFrameType === 'all'}
                      onChange={(e) => {
                        setSelectedFrameType(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="filter-input"
                    />
                    <span className="filter-text">All Frame Types</span>
                  </label>
                </li>
                {frameTypes.map(frameType => (
                  <li key={frameType.id} className="filter-item">
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="frameType"
                        value={frameType.id}
                        checked={selectedFrameType === frameType.id}
                        onChange={(e) => {
                          setSelectedFrameType(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="filter-input"
                      />
                      <span className="filter-text">
                        {frameType.name}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h4 className="filter-group__title">Frame Shape</h4>
              <ul className="filter-list">
                <li className="filter-item">
                  <label className="filter-label">
                    <input
                      type="radio"
                      name="frameShape"
                      value="all"
                      checked={selectedFrameShape === 'all'}
                      onChange={(e) => {
                        setSelectedFrameShape(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="filter-input"
                    />
                    <span className="filter-text">All Frame Shapes</span>
                  </label>
                </li>
                {frameShapes.map(frameShape => (
                  <li key={frameShape.id} className="filter-item">
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="frameShape"
                        value={frameShape.id}
                        checked={selectedFrameShape === frameShape.id}
                        onChange={(e) => {
                          setSelectedFrameShape(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="filter-input"
                      />
                      <span className="filter-text">
                        {frameShape.name}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h4 className="filter-group__title">Material</h4>
              <ul className="filter-list">
                <li className="filter-item">
                  <label className="filter-label">
                    <input
                      type="radio"
                      name="material"
                      value="all"
                      checked={selectedMaterial === 'all'}
                      onChange={(e) => {
                        setSelectedMaterial(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="filter-input"
                    />
                    <span className="filter-text">All Materials</span>
                  </label>
                </li>
                {materials.map(material => (
                  <li key={material.id} className="filter-item">
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="material"
                        value={material.id}
                        checked={selectedMaterial === material.id}
                        onChange={(e) => {
                          setSelectedMaterial(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="filter-input"
                      />
                      <span className="filter-text">
                        {material.name}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Right Products Grid */}
        <main className="products-main">
          <div className="products-grid">
            {currentProducts.map(product => (
              <div key={product.id} className="product-grid-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <div className="pagination__dots">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`pagination__dot ${
                      currentPage === page ? 'pagination__dot--active' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Related Products Section */}
          <div className="related-products">
            <div className="related-products__row">
              {products.slice(0, 5).map(product => (
                <div key={`related-1-${product.id}`} className="related-product">
                  <div className="related-product__image">
                    <img src={product.image} alt={product.name} />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Banner */}
            <div className="products-cta-banner">
              <div className="products-cta-banner__content">
                <h3>Find Your Perfect Ray-Ban Style</h3>
                <p>Discover our complete collection of premium eyewear</p>
              </div>
            </div>

            <div className="related-products__row">
              {products.slice(5, 10).map(product => (
                <div key={`related-2-${product.id}`} className="related-product">
                  <div className="related-product__image">
                    <img src={product.image} alt={product.name} />
                  </div>
                </div>
              ))}
              {/* Ensure we always have 5 cards */}
              {Array.from({ length: Math.max(0, 5 - products.slice(5, 10).length) }, (_, i) => (
                <div key={`placeholder-${i}`} className="related-product">
                  <div className="related-product__image">
                    <div className="product-placeholder">Product {i + 6}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Footer Content Grid - Same as Homepage */}
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

export default ProductsPage;
