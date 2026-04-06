import React, { createContext, useState, useCallback, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurantId = localStorage.getItem('restaurantId');

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Failed to load cart:', err);
      }
    }

    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    }
  }, []);

  // Save cart to localStorage
  const saveCart = useCallback((newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
  }, []);

  const addItem = useCallback(
    (item, restaurant) => {
      if (restaurantId && restaurantId !== restaurant._id) {
        // Clear cart if switching restaurants
        setCart([]);
        setRestaurantId(restaurant._id);
        localStorage.setItem('restaurantId', restaurant._id);
        saveCart([{ ...item, quantity: 1 }]);
      } else {
        const existingItem = cart.find((i) => i._id === item._id);

        if (existingItem) {
          const newCart = cart.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          );
          saveCart(newCart);
        } else {
          saveCart([...cart, { ...item, quantity: 1 }]);
          setRestaurantId(restaurant._id);
          localStorage.setItem('restaurantId', restaurant._id);
        }
      }
    },
    [cart, restaurantId, saveCart]
  );

  const removeItem = useCallback(
    (itemId) => {
      const newCart = cart.filter((item) => item._id !== itemId);
      saveCart(newCart);

      if (newCart.length === 0) {
        setRestaurantId(null);
        localStorage.removeItem('restaurantId');
      }
    },
    [cart, saveCart]
  );

  const updateQuantity = useCallback(
    (itemId, quantity) => {
      if (quantity <= 0) {
        removeItem(itemId);
      } else {
        const newCart = cart.map((item) =>
          item._id === itemId ? { ...item, quantity } : item
        );
        saveCart(newCart);
      }
    },
    [cart, removeItem, saveCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setRestaurantId(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('restaurantId');
  }, []);

  const getTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const getItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const value = {
    cart,
    restaurantId,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
