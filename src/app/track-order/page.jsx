'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const fetchTrackOrder = async (searchStr) => {
    if (!searchStr.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(searchStr.trim())}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
        setError('');
      } else {
        setOrder(null);
        setError(data.message || 'No order found with provided details');
      }
    } catch (err) {
      setError('Error tracking order. Please try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTrackOrder(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTrackOrder(query);
  };

  const steps = [
    { key: 'pending', label: 'Order Placed', icon: 'ri-file-list-3-line' },
    { key: 'confirmed', label: 'Confirmed', icon: 'ri-checkbox-circle-line' },
    { key: 'processing', label: 'Processing', icon: 'ri-archive-line' },
    { key: 'shipped', label: 'Shipped', icon: 'ri-truck-line' },
    { key: 'delivered', label: 'Delivered', icon: 'ri-home-smile-line' },
  ];

  const getStepStatus = (stepKey, currentStatus) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (currentIndex >= stepIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="sf-section" style={{ paddingTop: '40px' }}>
      <div className="sf-container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
            Live Shipment Status
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 900, marginTop: '4px' }}>Track Your Order</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
            Enter your Order Number (e.g. NLZ-84920) or Phone Number used during checkout.
          </p>

          <form
            onSubmit={handleSearch}
            style={{
              display: 'flex',
              maxWidth: '480px',
              margin: '24px auto 0',
              gap: '10px',
            }}
          >
            <input
              type="text"
              required
              placeholder="Order Number or Phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                background: '#000000',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </form>

          {error && (
            <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '12px', fontWeight: 600 }}>
              {error}
            </p>
          )}
        </div>

        {/* Order Result Card */}
        {order && (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                paddingBottom: '20px',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '28px',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Order Number</span>
                <h2 style={{ fontSize: '20px', fontWeight: 900 }}>{order.orderNumber}</h2>
              </div>

              <div>
                <span
                  className={`status-badge badge-${order.orderStatus}`}
                  style={{ fontSize: '13px', padding: '6px 14px' }}
                >
                  Status: {order.orderStatus.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Timeline Progress Tracker */}
            <div style={{ marginBottom: '40px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  textAlign: 'center',
                  gap: '8px',
                }}
              >
                {steps.map((step) => {
                  const state = getStepStatus(step.key, order.orderStatus);
                  const isCompleted = state === 'completed';

                  return (
                    <div key={step.key} style={{ position: 'relative' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: isCompleted ? '#000000' : '#f1f5f9',
                          color: isCompleted ? '#ffffff' : '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '18px',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <i className={step.icon}></i>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: isCompleted ? 800 : 500,
                          color: isCompleted ? '#0f172a' : '#94a3b8',
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                fontSize: '13px',
              }}
            >
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '6px' }}>
                  Delivery Destination
                </h4>
                <p><b>Recipient:</b> {order.customer.name}</p>
                <p><b>Phone:</b> {order.customer.phone}</p>
                <p><b>Address:</b> {order.customer.address}, {order.customer.city}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '6px' }}>
                  Payment Details
                </h4>
                <p><b>Method:</b> {order.paymentMethod.toUpperCase()}</p>
                <p><b>Payment Status:</b> {order.paymentStatus}</p>
                <p><b>Total Amount:</b> ৳ {order.totalAmount}</p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>
                Items in this order ({order.items.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h5 style={{ fontSize: '13px', fontWeight: 700 }}>{item.title}</h5>
                      {item.variantLabel && (
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{item.variantLabel}</span>
                      )}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>
                      {item.quantity} × ৳ {item.price} = <b>৳ {item.total}</b>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading order tracking...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
