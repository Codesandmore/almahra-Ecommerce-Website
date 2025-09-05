import React from "react";
import Cart from "../../components/Cart.jsx";
import "./CartPage.css";

const CartPage = () => {
  return (
    <div className="cart-page">
      <div className="container">
        <Cart />
      </div>
    </div>
  );
};

export default CartPage;
