'use client';

import React, { useState, useEffect } from 'react';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      if (data.success) setBrands(data.brands || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreateBrand = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          logo: logo.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setName('');
        setLogo('');
        setDescription('');
        fetchBrands();
      } else {
        alert(data.message || 'Error adding brand');
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
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Brands Management</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Manage store manufacturers, labels, and product brands ({brands.length} brands)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={{
            padding: '10px 18px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          }}
        >
          <i className="ri-add-line"></i> Add New Brand
        </button>
      </div>

      {/* Brands Grid */}
      <div className="admin-table-card">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading brands...</div>
        ) : brands.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>No brands registered.</div>
        ) : (
          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {brands.map((b) => (
              <div
                key={b._id || b.slug}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: '#0f172a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  {b.name[0]}
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{b.name}</h4>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                    {b.description || 'Featured manufacturer / fashion label'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Brand Modal */}
      {modalOpen && (
        <div className="vp-overlay" onClick={() => setModalOpen(false)}>
          <div className="vp-dialog" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900 }}>Add New Brand</h2>
              <button type="button" className="nav-action-btn" onClick={() => setModalOpen(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form onSubmit={handleCreateBrand} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Brand Name <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zara, NEW LOOK_Z Signature, Urban Denim"
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Logo Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
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
                  Description / Origin
                </label>
                <textarea
                  rows={3}
                  placeholder="Short note about the brand"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-checkout"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', fontSize: '14px', marginTop: '8px' }}
              >
                Save Brand
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
