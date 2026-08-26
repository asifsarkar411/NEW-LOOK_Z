'use client';

import React, { useState, useEffect } from 'react';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [marqueeText, setMarqueeText] = useState('');
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('/shop');
  const [savedMsg, setSavedMsg] = useState('');

  const fetchBanners = async () => {
    try {
      const [banRes, setRes] = await Promise.all([
        fetch('/api/banners'),
        fetch('/api/settings'),
      ]);
      const [banData, setData] = await Promise.all([banRes.json(), setRes.json()]);

      if (banData.success) setBanners(banData.banners || []);
      if (setData.success) setMarqueeText(setData.setting?.topbarMarquee || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!image.trim()) return;

    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'Seasonal Promotional Banner',
          image: image.trim(),
          link: link.trim() || '/shop',
          type: 'hero',
          order: banners.length + 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTitle('');
        setImage('');
        setLink('/shop');
        fetchBanners();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateMarquee = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topbarMarquee: marqueeText }),
      });
      if (res.ok) {
        setSavedMsg('Marquee text updated successfully!');
        setTimeout(() => setSavedMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Banners & Announcement</h1>
        <p style={{ fontSize: '13px', color: '#64748b' }}>Manage hero carousel slides and top marquee notification</p>
      </div>

      {/* Topbar Marquee Editor */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>
          Top Announcement Bar (Marquee Text)
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
          This message scrolls continuously at the top of every storefront page.
        </p>

        {savedMsg && (
          <div
            style={{
              padding: '10px 14px',
              background: '#d1fae5',
              color: '#065f46',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            ✓ {savedMsg}
          </div>
        )}

        <form onSubmit={handleUpdateMarquee} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            required
            value={marqueeText}
            onChange={(e) => setMarqueeText(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            className="btn-checkout"
            style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '14px' }}
          >
            Save Announcement
          </button>
        </form>
      </div>

      {/* Hero Banners */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '32px' }}>
        {/* Add Banner Form */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            height: 'fit-content',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Add Hero Banner</h3>

          <form onSubmit={handleAddBanner} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                Banner Title
              </label>
              <input
                type="text"
                placeholder="e.g. Eid Collection 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                Image URL (Wide banner) <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
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

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                Destination Link URL
              </label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
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
              Add Slide
            </button>
          </form>
        </div>

        {/* Existing Banners */}
        <div className="admin-table-card">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Active Hero Banners ({banners.length})</h3>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {banners.map((b, idx) => (
              <div
                key={b._id || idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <img
                  src={b.image}
                  alt={b.title}
                  style={{ width: '160px', height: '90px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, padding: '10px 0' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800 }}>{b.title}</h4>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Target Link: {b.link}</p>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>● Active Slide</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
