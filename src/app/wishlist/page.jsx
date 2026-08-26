'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <div className="sf-section" style={{ paddingTop: '40px' }}>
      <div className="sf-container">
        <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px' }}>My Wishlist</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>
          Saved items ({wishlist.length})
        </p>

        {wishlist.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
            }}
          >
            <i
              className="ri-heart-line"
              style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '12px', display: 'block' }}
            ></i>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Your Wishlist is Empty</h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
              Explore our latest arrivals and tap the heart icon to save products here.
            </p>
            <Link href="/shop" className="btn-see-all">
              Discover Products
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px',
            }}
          >
            {wishlist.map((item) => (
              <div
                key={item._id || item.id || item.productId}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ width: '100%', aspectRatio: '1 / 1.1', overflow: 'hidden' }}>
                  <img
                    src={item.primaryImage || item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => toggleWishlist(item)}
                  title="Remove from Wishlist"
                >
                  <i className="ri-close-line"></i>
                </button>

                <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
                    <Link href={`/shop/${item.slug}`}>{item.title}</Link>
                  </h4>
                  <span style={{ fontSize: '16px', fontWeight: 800, marginTop: 'auto', marginBottom: '12px' }}>
                    ৳ {item.sellingPrice || item.price}
                  </span>

                  <button
                    type="button"
                    className="btn-checkout"
                    style={{ padding: '10px', fontSize: '13px', borderRadius: '6px' }}
                    onClick={() => {
                      addToCart(item, '', '', 1);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
