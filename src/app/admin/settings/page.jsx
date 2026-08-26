'use client';

import React, { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    storeName: 'NEW LOOK_Z',
    storeTagline: 'Trending Lifestyle & Fashion Store',
    phone: '+8801824416130',
    email: 'contact@newlookz.com',
    address: 'Mirpur 1, Dhaka, Bangladesh',
    whatsappNumber: '8801824416130',
    deliveryInsideDhaka: 60,
    deliveryOutsideDhaka: 120,
    freeDeliveryThreshold: 2500,
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
  });

  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.setting) {
          setForm(data.setting);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSavedMsg('Store settings saved successfully!');
        setTimeout(() => setSavedMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading settings...</div>;
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Store Settings</h1>
        <p style={{ fontSize: '13px', color: '#64748b' }}>Configure branding, contact information, and shipping rates</p>
      </div>

      {savedMsg && (
        <div
          style={{
            padding: '12px 16px',
            background: '#d1fae5',
            color: '#065f46',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '20px',
          }}
        >
          ✓ {savedMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 800, borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
          General Branding
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Store Name
            </label>
            <input
              type="text"
              required
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Tagline
            </label>
            <input
              type="text"
              value={form.storeTagline}
              onChange={(e) => setForm({ ...form, storeTagline: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 800, borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginTop: '10px' }}>
          Contact & Support
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Phone Number
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Support Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              WhatsApp Number (with country code, e.g. 8801824416130)
            </label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Physical Store Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 800, borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginTop: '10px' }}>
          Shipping & Delivery Charges
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Inside Dhaka (৳)
            </label>
            <input
              type="number"
              value={form.deliveryInsideDhaka}
              onChange={(e) => setForm({ ...form, deliveryInsideDhaka: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Outside Dhaka (৳)
            </label>
            <input
              type="number"
              value={form.deliveryOutsideDhaka}
              onChange={(e) => setForm({ ...form, deliveryOutsideDhaka: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Free Delivery Min Spend (৳)
            </label>
            <input
              type="number"
              value={form.freeDeliveryThreshold}
              onChange={(e) => setForm({ ...form, freeDeliveryThreshold: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-checkout"
          style={{ width: '100%', padding: '14px', borderRadius: '8px', fontSize: '15px', marginTop: '12px' }}
        >
          Save All Store Settings
        </button>
      </form>
    </div>
  );
}
