'use client';

import React, { useState, useEffect } from 'react';

export default function AdminColorsPage() {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('#6366f1');

  const fetchColors = async () => {
    try {
      const res = await fetch('/api/colors');
      const data = await res.json();
      if (data.success) setColors(data.colors || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleCreateColor = async (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    try {
      const res = await fetch('/api/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setName('');
        setCode('#6366f1');
        fetchColors();
      } else {
        alert(data.message || 'Error adding color');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Colors & Swatches</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Manage color palettes and hex swatch codes for automatic product variants ({colors.length} colors)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={{
            padding: '10px 18px',
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
          }}
        >
          <i className="ri-palette-line"></i> Add New Color
        </button>
      </div>

      {/* Colors Grid */}
      <div className="admin-table-card">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading colors...</div>
        ) : (
          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {colors.map((c) => (
              <div
                key={c._id || c.slug}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: c.code,
                    border: '2px solid #ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    flexShrink: 0,
                  }}
                ></div>

                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{c.name}</h4>
                  <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                    {c.code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Color Modal */}
      {modalOpen && (
        <div className="vp-overlay" onClick={() => setModalOpen(false)}>
          <div className="vp-dialog" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900 }}>Add New Color</h2>
              <button type="button" className="nav-action-btn" onClick={() => setModalOpen(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form onSubmit={handleCreateColor} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Color Name <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lavender, Midnight Black, Olive"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Pick Color Swatch
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="color"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ width: '48px', height: '44px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="#HEX"
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: code,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  }}
                ></div>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>
                  Preview: {name || 'New Color'} ({code})
                </span>
              </div>

              <button
                type="submit"
                className="btn-checkout"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', fontSize: '14px' }}
              >
                Save Color
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
