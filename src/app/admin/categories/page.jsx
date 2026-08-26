'use client';

import React, { useState, useEffect } from 'react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [subcategoriesStr, setSubcategoriesStr] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.categories || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const subcats = subcategoriesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({
        name: s,
        slug: s.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }));

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          image: image.trim() || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80',
          subcategories: subcats,
          featured: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setName('');
        setImage('');
        setSubcategoriesStr('');
        fetchCategories();
      } else {
        alert(data.message || 'Failed to add category');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Categories Management</h1>
        <p style={{ fontSize: '13px', color: '#64748b' }}>Create and organize storefront categories & subcategories</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '32px' }}>
        {/* Add Category Form */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            height: 'fit-content',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Add New Category</h3>

          <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                Category Name <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Winter Wear"
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
                Image URL
              </label>
              <input
                type="url"
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
                Subcategories (Comma separated)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Hoodies, Sweaters, Jackets"
                value={subcategoriesStr}
                onChange={(e) => setSubcategoriesStr(e.target.value)}
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
              style={{ width: '100%', padding: '12px', borderRadius: '8px', fontSize: '14px' }}
            >
              Add Category
            </button>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="admin-table-card">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Store Categories ({categories.length})</h3>
          </div>

          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {categories.map((cat) => (
              <div
                key={cat.slug}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800 }}>{cat.name}</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {cat.subcategories?.length || 0} subcategories
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    {cat.subcategories?.slice(0, 3).map((sub) => (
                      <span
                        key={sub.slug}
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          background: '#ffffff',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
