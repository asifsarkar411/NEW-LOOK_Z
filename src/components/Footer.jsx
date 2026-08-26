'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer({ setting = {} }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const storePhone = setting.phone || '+8801824416130';
  const storeEmail = setting.email || 'contact@newlookz.com';
  const storeAddress = setting.address || 'Mirpur 1, Dhaka, Bangladesh';

  return (
    <>
      {/* 4 Feature Badges area */}
      <section className="sf-info-area">
        <div className="sf-container">
          <div className="sf-features-inner">
            <div className="sf-single-feature">
              <div className="sf-f-icon">
                <i className="ri-truck-line"></i>
              </div>
              <h6>Fast Delivery</h6>
              <p>Reliable shipping all across Bangladesh</p>
            </div>

            <div className="sf-single-feature">
              <div className="sf-f-icon">
                <i className="ri-refresh-line"></i>
              </div>
              <h6>Easy Return Policy</h6>
              <p>Hassle-free 7-day return guarantee</p>
            </div>

            <div className="sf-single-feature">
              <div className="sf-f-icon">
                <i className="ri-customer-service-2-line"></i>
              </div>
              <h6>24/7 Dedicated Support</h6>
              <p>Friendly support available via WhatsApp & Call</p>
            </div>

            <div className="sf-single-feature">
              <div className="sf-f-icon">
                <i className="ri-shield-check-line"></i>
              </div>
              <h6>100% Secure Payment</h6>
              <p>Cash on Delivery & Verified Mobile Banking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="sf-footer">
        <footer className="sf-container">
          <div className="footer-grid-container">
            {/* Brand column */}
            <div className="business">
              <div className="logo" style={{ marginBottom: '16px' }}>
                <Link href="/" className="nav-logo">
                  <span className="brand-logo-text" style={{ color: '#ffffff', fontSize: '20px' }}>
                    NEW LOOK_Z
                  </span>
                </Link>
              </div>

              <p>
                <i className="ri-mail-line" style={{ marginRight: '8px' }}></i>
                <a href={`mailto:${storeEmail}`}>{storeEmail}</a>
              </p>
              <p>
                <i className="ri-phone-line" style={{ marginRight: '8px' }}></i>
                <a href={`tel:${storePhone}`}>{storePhone}</a>
              </p>
              <p>
                <i className="ri-map-pin-line" style={{ marginRight: '8px' }}></i>
                <span>{storeAddress}</span>
              </p>
            </div>

            {/* The Brand */}
            <div className="about">
              <h6>The Brand</h6>
              <p><Link href="/about">About Us</Link></p>
              <p><Link href="/contact">Contact Us</Link></p>
              <p><Link href="/shop">Shop Collection</Link></p>
              <p><Link href="/categories">All Categories</Link></p>
            </div>

            {/* Help & Guide */}
            <div className="help">
              <h6>Help & Guide</h6>
              <p><Link href="/wishlist">Wishlist</Link></p>
              <p><Link href="/track-order">Order Tracking</Link></p>
              <p><Link href="/page/return-policy">Return Policy</Link></p>
              <p><Link href="/page/privacy-policy">Privacy Policy</Link></p>
              <p><Link href="/page/terms-conditions">Terms & Conditions</Link></p>
            </div>

            {/* Newsletter */}
            <div className="newsletter">
              <h6>Exclusive Newsletter</h6>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>
                Subscribe to receive special offers, new arrival drops, and exclusive flash deal codes.
              </p>

              {subscribed ? (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#10b981',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  <i className="ri-checkbox-circle-line" style={{ marginRight: '6px' }}></i>
                  Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    required
                    className="newsletter-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="btn-subscribe">
                    Subscribe Now
                  </button>
                </form>
              )}
            </div>
          </div>
        </footer>

        <div className="footer-bottom">
          <div className="sf-container">
            <p className="copyright">
              &copy; {new Date().getFullYear()} <b>NEW LOOK_Z</b>. All rights reserved. Powered by Next.js & MongoDB.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
