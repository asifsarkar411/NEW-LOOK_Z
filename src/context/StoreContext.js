'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [variantModal, setVariantModal] = useState({
    isOpen: false,
    product: null,
    action: 'cart', // 'cart' or 'buy'
  });

  // Load cart and wishlist from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('newlookz_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('newlookz_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error('Error loading stored state:', e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('newlookz_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('newlookz_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  const addToCart = (product, variantLabel = '', variantId = '', quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === (product._id || product.id) && item.variantId === variantId
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          productId: product._id || product.id,
          title: product.title,
          slug: product.slug,
          image: product.primaryImage || product.images?.[0] || '',
          price: product.sellingPrice,
          regularPrice: product.regularPrice,
          variantLabel,
          variantId,
          quantity,
          category: product.category,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (index, delta) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index].quantity = newQty;
      }
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    const id = product._id || product.id || product.productId;
    setWishlist((prev) => {
      const exists = prev.some((item) => (item._id || item.id || item.productId) === id);
      if (exists) {
        return prev.filter((item) => (item._id || item.id || item.productId) !== id);
      } else {
        return [
          ...prev,
          {
            _id: id,
            id,
            productId: id,
            title: product.title,
            slug: product.slug,
            primaryImage: product.primaryImage || product.images?.[0] || product.image || '',
            sellingPrice: product.sellingPrice || product.price,
            regularPrice: product.regularPrice,
            category: product.category,
          },
        ];
      }
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => (item._id || item.id || item.productId) === productId);
  };

  const openVariantPicker = (product, action = 'cart') => {
    setVariantModal({
      isOpen: true,
      product,
      action,
    });
  };

  const closeVariantPicker = () => {
    setVariantModal({
      isOpen: false,
      product: null,
      action: 'cart',
    });
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        variantModal,
        openVariantPicker,
        closeVariantPicker,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        cartSubtotal,
        cartCount,
        wishlistCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
