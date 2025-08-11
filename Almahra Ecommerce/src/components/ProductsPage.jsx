import React from "react";
import { Link } from "react-router-dom";
import { products } from "./productsData";

const ProductsPage = ({ onAddToCart }) => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
            key={product.id}
          >
            <Link to={`/products/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-40 h-40 object-cover mb-2 rounded"
              />
              <h2 className="text-lg font-semibold mb-1 text-gray-800">
                {product.name}
              </h2>
            </Link>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <span className="text-xl font-bold text-green-600 mb-2">
              {product.price}
            </span>
            <button
              onClick={() => onAddToCart(product)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
