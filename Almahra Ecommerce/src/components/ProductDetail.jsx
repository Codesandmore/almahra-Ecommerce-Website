import React from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "./productsData";

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="text-center text-red-600 mt-10">Product not found.</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <Link to="/products" className="text-blue-600 hover:underline">
        &larr; Back to Products
      </Link>
      <img
        src={product.image}
        alt={product.name}
        className="w-64 h-64 object-cover mx-auto my-4 rounded"
      />
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700 mb-2">{product.description}</p>
      <span className="text-xl font-bold text-green-600 mb-4 block">
        {product.price}
      </span>
      <button
        onClick={() => onAddToCart(product)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetail;
