import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ProductsPage from "./components/ProductsPage";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Navbar from "./components/Navbar";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          price: parseFloat(product.price.replace("$", "")),
          quantity: 1,
        },
      ];
    });
  };
  const handleQuantityChange = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };
  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Router>
      <Navbar
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />
      <Routes>
        <Route
          path="/"
          element={<ProductsPage onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/products"
          element={<ProductsPage onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/products/:id"
          element={<ProductDetail onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
