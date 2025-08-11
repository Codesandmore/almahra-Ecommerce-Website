import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ cartCount }) => (
  <nav className="bg-gray-800 p-4">
    <ul className="flex items-center space-x-4 text-white">
      <li>
        <Link to="/" className="hover:text-yellow-400">
          Home
        </Link>
      </li>
      <li>
        <Link to="/products" className="hover:text-yellow-400">
          Products
        </Link>
      </li>
      <li className="ml-auto">
        <Link to="/cart" className="hover:text-yellow-400 font-bold">
          Cart ({cartCount})
        </Link>
      </li>
    </ul>
  </nav>
);

export default Navbar;
