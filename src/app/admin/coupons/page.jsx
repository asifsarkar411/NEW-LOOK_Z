'use client';

import React, { useState, useEffect } from 'react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minimumSpend, setMinimumSpend] = useState(0);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success) setCoupons(data.coupons || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discountType,
          discountValue: Number(discountValue),
          minimumSpend: Number(minimumSpend) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCode('');
        setDiscountValue('');
        setMinimumSpend(0);
        fetchCoupons();
      } else {
        alert(data.message || 'Failed to create coupon');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Coupons & Discounts</h1>
        <p style={{ fontSize: '13px', color: '#64748b' }}>Create discount codes for customer promotions</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '32px' }}>
        {/* Create Coupon */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            height: 'fit-content',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Create New Coupon</h3>

          <form onSubmit={handleAddCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                Coupon Code <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SAVE25, SUMMER10"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  textTransform: 'uppercase',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Discount Type
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#ffffff',
                  }}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (৳)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Value <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder={discountType === 'percentage' ? '25' : '200'}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                Minimum Spend (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={minimumSpend}
                onChange={(e) => setMinimumSpend(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-checkout"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', fontSize: '14px' }}
            >
              Create Coupon
            </button>
          </form>
        </div>

        {/* Coupons Table */}
        <div className="admin-table-card">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Active Coupons ({coupons.length})</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Min Spend</th>
                  <th>Times Used</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <b style={{ color: '#000000', fontSize: '15px' }}>{c.code}</b>
                    </td>
                    <td>
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `৳ ${c.discountValue} OFF`}
                    </td>
                    <td>{c.minimumSpend ? `৳ ${c.minimumSpend}` : 'None'}</td>
                    <td>{c.usedCount || 0} times</td>
                    <td>
                      <span className="status-badge badge-delivered">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
