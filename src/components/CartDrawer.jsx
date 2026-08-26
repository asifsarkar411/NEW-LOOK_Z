'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartSubtotal, cartCount } =
    useStore();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 2500;
  const progress = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));
  const remainingForFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>

      <section className="cart is-open" aria-label="Shopping Cart">
        {/* Header */}
        <div className="cart-drawer-head">
          <div className="cart-drawer-titlerow">
            <h2>Shopping Cart ({cartCount})</h2>
            <button
              type="button"
              className="cart-drawer-close"
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div style={{ marginTop: '12px' }}>
            <p style={{ fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
              {remainingForFree > 0 ? (
                <>
                  Add <b>৳ {remainingForFree}</b> more to get <b>FREE DELIVERY</b>!
                </>
              ) : (
                <span style={{ color: '#10b981', fontWeight: 700 }}>
                  🎉 Congratulations! You qualify for Free Delivery!
                </span>
              )}
            </p>
            <div
              style={{
                width: '100%',
                height: '6px',
                background: '#e2e8f0',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: remainingForFree > 0 ? '#000000' : '#10b981',
                  transition: 'width 0.3s ease',
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <i
                className="ri-shopping-bag-3-line"
                style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '12px', display: 'block' }}
              ></i>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
                Your cart is empty
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                Explore our catalog to find your next favorite outfit.
              </p>
              <button
                type="button"
                className="btn-see-all"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.productId}-${item.variantId}-${index}`} className="cart-item-row">
                <img src={item.image} alt={item.title} className="cart-item-img" />

                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.title}</h4>
                  {item.variantLabel && (
                    <p className="cart-item-variant">{item.variantLabel}</p>
                  )}
                  <span className="cart-item-price">৳ {item.price}</span>

                  <div className="cart-item-qty">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQuantity(index, -1)}
                    >
                      -
                    </button>
                    <span className="qty-num">{item.quantity}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQuantity(index, 1)}
                    >
                      +
                    </button>

                    <button
                      type="button"
                      style={{
                        marginLeft: 'auto',
                        color: '#ef4444',
                        fontSize: '16px',
                      }}
                      onClick={() => removeFromCart(index)}
                      title="Remove"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal-row">
              <span>Subtotal</span>
              <span>৳ {cartSubtotal}</span>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
              Shipping and taxes calculated at checkout.
            </p>

            <Link
              href="/checkout"
              className="btn-checkout"
              onClick={() => setIsCartOpen(false)}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
