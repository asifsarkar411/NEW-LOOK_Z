'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Dhaka',
    zone: 'inside_dhaka',
    note: '',
    paymentMethod: 'cod',
    transactionId: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const deliveryCharge = formData.zone === 'inside_dhaka' ? 60 : 120;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const totalAmount = Math.max(0, cartSubtotal + deliveryCharge - discountAmount);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal: cartSubtotal }),
      });
      const data = await res.json();

      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponError('');
      } else {
        setCouponError(data.message || 'Invalid coupon');
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg('Your cart is empty. Please add items before checkout.');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city,
          zone: formData.zone,
          note: formData.note,
        },
        items: cart.map((item) => ({
          productId: item.productId,
          title: item.title,
          slug: item.slug,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          variantLabel: item.variantLabel || '',
          variantId: item.variantId || '',
          total: item.price * item.quantity,
        })),
        subtotal: cartSubtotal,
        deliveryCharge,
        discount: discountAmount,
        couponCode: appliedCoupon?.code || '',
        totalAmount,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setOrderSuccess(data.order);
        clearCart();
      } else {
        setErrorMsg(data.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order error:', err);
      setErrorMsg('Network error while creating order.');
    } finally {
      setSubmitting(false);
    }
  };

  // Order Success Receipt View
  if (orderSuccess) {
    return (
      <div className="sf-section" style={{ paddingTop: '40px' }}>
        <div className="sf-container" style={{ maxWidth: '640px' }}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '36px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#d1fae5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                margin: '0 auto 16px',
              }}
            >
              <i className="ri-check-line"></i>
            </div>

            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#10b981',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Order Placed Successfully
            </span>

            <h1 style={{ fontSize: '26px', fontWeight: 900, margin: '8px 0 12px' }}>
              Thank you, {orderSuccess.customer.name}!
            </h1>

            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
              Your order has been received and is being processed. We will contact you at{' '}
              <b>{orderSuccess.customer.phone}</b> for confirmation.
            </p>

            <div
              style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '24px',
                fontSize: '13px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#64748b' }}>Order Number:</span>
                <span style={{ fontWeight: 800, color: '#000000', fontSize: '15px' }}>
                  {orderSuccess.orderNumber}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#64748b' }}>Payment Method:</span>
                <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  {orderSuccess.paymentMethod} (Cash on Delivery)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#64748b' }}>Total Amount:</span>
                <span style={{ fontWeight: 800, color: '#000000', fontSize: '16px' }}>
                  ৳ {orderSuccess.totalAmount}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Delivery Address:</span>
                <span style={{ fontWeight: 600, maxWidth: '240px', textAlign: 'right' }}>
                  {orderSuccess.customer.address}, {orderSuccess.customer.city}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link
                href={`/track-order?q=${orderSuccess.orderNumber}`}
                className="btn-see-all"
                style={{ background: '#000000', color: '#ffffff', border: 'none' }}
              >
                Track This Order <i className="ri-box-3-line"></i>
              </Link>
              <Link href="/" className="btn-see-all">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If Cart is empty and no active order
  if (cart.length === 0) {
    return (
      <div className="sf-section" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <i
          className="ri-shopping-bag-3-line"
          style={{ fontSize: '56px', color: '#cbd5e1', marginBottom: '16px', display: 'block' }}
        ></i>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Your Cart is Empty</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link href="/shop" className="btn-see-all">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="sf-section" style={{ paddingTop: '30px' }}>
      <div className="sf-container">
        <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '24px' }}>
          Express Checkout
        </h1>

        {errorMsg && (
          <div
            style={{
              padding: '14px',
              borderRadius: '8px',
              background: '#fee2e2',
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
            }}
          >
            {/* Left Column: Customer & Delivery Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '18px' }}>
                  1. Delivery Information
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                      Full Name <span style={{ color: '#e11d48' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Asif Sarkar"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                      Mobile Phone Number <span style={{ color: '#e11d48' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 017xxxxxxxx"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. asif@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                      Full Delivery Address <span style={{ color: '#e11d48' }}>*</span>
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={3}
                      placeholder="House, Road, Area, Ward/Thana..."
                      value={formData.address}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    ></textarea>
                  </div>

                  {/* Delivery Area Selection */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                      Delivery Zone
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '14px',
                          borderRadius: '8px',
                          border: formData.zone === 'inside_dhaka' ? '2px solid #000000' : '1px solid #e2e8f0',
                          background: formData.zone === 'inside_dhaka' ? '#f8fafc' : '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="zone"
                          value="inside_dhaka"
                          checked={formData.zone === 'inside_dhaka'}
                          onChange={handleInputChange}
                        />
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 700 }}>Inside Dhaka</p>
                          <p style={{ fontSize: '12px', color: '#64748b' }}>৳ 60 (24-48 hrs)</p>
                        </div>
                      </label>

                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '14px',
                          borderRadius: '8px',
                          border: formData.zone === 'outside_dhaka' ? '2px solid #000000' : '1px solid #e2e8f0',
                          background: formData.zone === 'outside_dhaka' ? '#f8fafc' : '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="zone"
                          value="outside_dhaka"
                          checked={formData.zone === 'outside_dhaka'}
                          onChange={handleInputChange}
                        />
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 700 }}>Outside Dhaka</p>
                          <p style={{ fontSize: '12px', color: '#64748b' }}>৳ 120 (3-5 days)</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px' }}>
                  2. Payment Method
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      borderRadius: '8px',
                      border: formData.paymentMethod === 'cod' ? '2px solid #000000' : '1px solid #e2e8f0',
                      background: formData.paymentMethod === 'cod' ? '#f8fafc' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="ri-hand-coin-line" style={{ fontSize: '20px' }}></i>
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>
                        Cash on Delivery (Pay when you receive the product)
                      </span>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      borderRadius: '8px',
                      border: formData.paymentMethod === 'bkash' ? '2px solid #000000' : '1px solid #e2e8f0',
                      background: formData.paymentMethod === 'bkash' ? '#f8fafc' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={formData.paymentMethod === 'bkash'}
                      onChange={handleInputChange}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="ri-smartphone-line" style={{ fontSize: '20px', color: '#e11d48' }}></i>
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>
                        bKash / Nagad Send Money (01824416130)
                      </span>
                    </div>
                  </label>

                  {formData.paymentMethod === 'bkash' && (
                    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', marginTop: '6px' }}>
                      <p style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>
                        Send ৳ {totalAmount} to Personal bKash/Nagad: <b>01824416130</b> and enter Transaction ID:
                      </p>
                      <input
                        type="text"
                        name="transactionId"
                        placeholder="e.g. 9X2A88K7"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Coupon Code */}
            <div>
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px',
                  position: 'sticky',
                  top: '100px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '18px' }}>
                  Order Summary ({cart.length} items)
                </h3>

                {/* Items List */}
                <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '20px' }}>
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        paddingBottom: '12px',
                        marginBottom: '12px',
                        borderBottom: '1px solid #f1f5f9',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.2 }}>
                          {item.title}
                        </h4>
                        {item.variantLabel && (
                          <span style={{ fontSize: '11px', color: '#64748b' }}>{item.variantLabel}</span>
                        )}
                        <p style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                          Qty: {item.quantity} × ৳ {item.price}
                        </p>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 800 }}>
                        ৳ {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Input Box */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. SAVE25)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        outline: 'none',
                        textTransform: 'uppercase',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        background: '#000000',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 700,
                      }}
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>

                  {couponError && (
                    <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', fontWeight: 600 }}>
                      {couponError}
                    </p>
                  )}

                  {appliedCoupon && (
                    <p style={{ color: '#10b981', fontSize: '12px', marginTop: '6px', fontWeight: 700 }}>
                      ✓ Coupon {appliedCoupon.code} applied (-৳ {discountAmount})
                    </p>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#64748b' }}>Subtotal</span>
                    <span style={{ fontWeight: 700 }}>৳ {cartSubtotal}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#64748b' }}>Delivery Charge</span>
                    <span style={{ fontWeight: 700 }}>৳ {deliveryCharge}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#10b981' }}>
                      <span>Coupon Discount</span>
                      <span style={{ fontWeight: 700 }}>- ৳ {discountAmount}</span>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '2px solid #000000',
                      paddingTop: '12px',
                      marginTop: '12px',
                      fontSize: '18px',
                      fontWeight: 900,
                    }}
                  >
                    <span>Grand Total</span>
                    <span>৳ {totalAmount}</span>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-checkout"
                  style={{ width: '100%', padding: '16px', borderRadius: '10px', fontSize: '16px' }}
                >
                  {submitting ? 'Placing Order...' : `Confirm Order (৳ ${totalAmount})`}
                </button>

                <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginTop: '12px' }}>
                  By clicking Confirm Order, you agree to our Terms and Return Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
