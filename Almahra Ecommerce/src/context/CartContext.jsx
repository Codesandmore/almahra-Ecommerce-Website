import React, { createContext, useContext, useReducer, useEffect } from "react";
import { storage } from "../utils/helpers.js";
import cartService from "../services/cartService.js";
import { useAuth } from "./AuthContext.jsx";

// Initial state
const getInitialState = () => {
  const savedCart = storage.get("cart");
  return (
    savedCart || {
      items: [],
      total: 0,
      itemCount: 0,
      isOpen: false,
    }
  );
};

// Action types
const CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  TOGGLE_CART: "TOGGLE_CART",
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, variant, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id && item.variant?.id === variant?.id
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem = {
          id: `${product.id}-${variant?.id || "default"}`,
          product,
          variant,
          quantity,
          price: product.price,
        };
        updatedItems = [...state.items, newItem];
      }

      const total = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        total,
        itemCount,
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      console.log('REMOVE_ITEM action called with ID:', action.payload.id);
      console.log('Current cart items:', state.items.map(item => ({ id: item.id, name: item.product.name })));
      
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      
      console.log('Items after removal:', updatedItems.map(item => ({ id: item.id, name: item.product.name })));
      const total = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        total,
        itemCount,
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        return cartReducer(state, {
          type: CART_ACTIONS.REMOVE_ITEM,
          payload: { id },
        });
      }

      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      const total = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        total,
        itemCount,
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        items: [],
        total: 0,
        itemCount: 0,
        isOpen: false,
      };

    case CART_ACTIONS.TOGGLE_CART:
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());
  const { isAuthenticated } = useAuth();

  // Load cart from backend when user logs in
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          const cartData = await cartService.getCart();
          if (cartData && cartData.items) {
            // Update state with backend cart
            dispatch({ type: CART_ACTIONS.CLEAR_CART });
            cartData.items.forEach(item => {
              dispatch({
                type: CART_ACTIONS.ADD_ITEM,
                payload: {
                  product: item.product,
                  variant: item.variant,
                  quantity: item.quantity
                }
              });
            });
          }
        } catch (err) {
          console.error('Error loading cart from backend:', err);
        }
      }
    };

    loadCart();
  }, [isAuthenticated]);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    storage.set("cart", state);
  }, [state]);

  const addToCart = async (product, variant = null, quantity = 1) => {
    // Update local state immediately
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, variant, quantity },
    });

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await cartService.addToCart({
          productId: product.id,
          variantId: variant?.id,
          quantity
        });
      } catch (err) {
        console.error('Error syncing cart with backend:', err);
      }
    }
  };

  const removeFromCart = async (id) => {
    // Extract product/variant IDs from the composite ID
    const [productId, variantId] = id.split('-');
    
    // Update local state immediately
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { id },
    });

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await cartService.removeFromCart(parseInt(productId), variantId !== 'default' ? parseInt(variantId) : null);
      } catch (err) {
        console.error('Error syncing cart removal with backend:', err);
      }
    }
  };

  const updateQuantity = async (id, quantity) => {
    // Extract product/variant IDs from the composite ID
    const [productId, variantId] = id.split('-');
    
    // Update local state immediately
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id, quantity },
    });

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await cartService.updateCartItem(parseInt(productId), {
          variantId: variantId !== 'default' ? parseInt(variantId) : null,
          quantity
        });
      } catch (err) {
        console.error('Error syncing cart update with backend:', err);
      }
    }
  };

  const clearCart = async () => {
    // Update local state immediately
    dispatch({ type: CART_ACTIONS.CLEAR_CART });

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.error('Error clearing cart on backend:', err);
      }
    }
  };

  const toggleCart = () => {
    dispatch({ type: CART_ACTIONS.TOGGLE_CART });
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
