'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action');
  const filterParam = searchParams.get('filter');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colorsList, setColorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState(['M', 'L', 'XL']);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    brand: '',
    category: '',
    categorySlug: '',
    subcategory: '',
    subcategorySlug: '',
    regularPrice: '',
    sellingPrice: '',
    primaryImage: '',
    stock: 50,
    sku: '',
    isFeatured: false,
    isNewArrival: true,
    isTopSelling: false,
    isTrending: false,
  });

  const fetchData = async () => {
    try {
      const [prodRes, catRes, brandRes, colorRes] = await Promise.all([
        fetch('/api/products?limit=200'),
        fetch('/api/categories'),
        fetch('/api/brands'),
        fetch('/api/colors'),
      ]);
      const [prodData, catData, brandData, colorData] = await Promise.all([
        prodRes.json(),
        catRes.json(),
        brandRes.json(),
        colorRes.json(),
      ]);

      if (prodData.success) setProducts(prodData.products || []);
      if (catData.success) {
        setCategories(catData.categories || []);
        if (catData.categories.length > 0 && !form.category) {
          setForm((f) => ({
            ...f,
            category: catData.categories[0].name,
            categorySlug: catData.categories[0].slug,
          }));
        }
      }
      if (brandData.success) setBrands(brandData.brands || []);
      if (colorData.success) setColorsList(colorData.colors || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (actionParam === 'new') {
      openAddModal();
    }
  }, [actionParam]);

  const openAddModal = () => {
    setEditingProduct(null);
    setSelectedColors(['Black', 'Navy Blue']);
    setSelectedSizes(['M', 'L', 'XL']);
    setForm({
      title: '',
      slug: '',
      description: '',
      shortDescription: '',
      brand: brands[0]?.name || 'NEW LOOK_Z Signature',
      category: categories[0]?.name || 'Mens Fashion',
      categorySlug: categories[0]?.slug || 'mens-fashion',
      subcategory: '',
      subcategorySlug: '',
      regularPrice: '',
      sellingPrice: '',
      primaryImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&auto=format&fit=crop&q=80',
      stock: 50,
      sku: '',
      isFeatured: false,
      isNewArrival: true,
      isTopSelling: false,
      isTrending: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    // Extract existing colors and sizes from axes
    const colorAxis = p.axes?.find((a) => a.name === 'Color');
    const sizeAxis = p.axes?.find((a) => a.name === 'Size');
    setSelectedColors(colorAxis ? colorAxis.values.map((v) => v.label) : ['Black']);
    setSelectedSizes(sizeAxis ? sizeAxis.values.map((v) => v.label) : ['M', 'L']);

    setForm({
      title: p.title,
      slug: p.slug,
      description: p.description || '',
      shortDescription: p.shortDescription || '',
      brand: p.brand || brands[0]?.name || '',
      category: p.category,
      categorySlug: p.categorySlug,
      subcategory: p.subcategory || '',
      subcategorySlug: p.subcategorySlug || '',
      regularPrice: p.regularPrice,
      sellingPrice: p.sellingPrice,
      primaryImage: p.primaryImage,
      stock: p.stock || 50,
      sku: p.sku || '',
      isFeatured: p.isFeatured || false,
      isNewArrival: p.isNewArrival || false,
      isTopSelling: p.isTopSelling || false,
      isTrending: p.isTrending || false,
    });
    setModalOpen(true);
  };

  const handleCategoryChange = (e) => {
    const selectedCat = categories.find((c) => c.slug === e.target.value);
    if (selectedCat) {
      setForm({
        ...form,
        category: selectedCat.name,
        categorySlug: selectedCat.slug,
        subcategory: selectedCat.subcategories?.[0]?.name || '',
        subcategorySlug: selectedCat.subcategories?.[0]?.slug || '',
      });
    }
  };

  const toggleColorSelect = (colorName) => {
    if (selectedColors.includes(colorName)) {
      setSelectedColors(selectedColors.filter((c) => c !== colorName));
    } else {
      setSelectedColors([...selectedColors, colorName]);
    }
  };

  const toggleSizeSelect = (sizeLabel) => {
    if (selectedSizes.includes(sizeLabel)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== sizeLabel));
    } else {
      setSelectedSizes([...selectedSizes, sizeLabel]);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.slug || editingProduct._id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      // Build Axes with selected colors & swatches + sizes
      const axes = [];

      if (selectedColors.length > 0) {
        axes.push({
          name: 'Color',
          values: selectedColors.map((cName) => {
            const matched = colorsList.find((c) => c.name === cName);
            return {
              label: cName,
              swatch: matched ? matched.code : '#000000',
            };
          }),
        });
      }

      if (selectedSizes.length > 0) {
        axes.push({
          name: 'Size',
          values: selectedSizes.map((s) => ({ label: s })),
        });
      }

      const payload = {
        ...form,
        regularPrice: Number(form.regularPrice),
        sellingPrice: Number(form.sellingPrice),
        stock: Number(form.stock),
        axes,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchData();
      } else {
        alert(data.message || 'Failed to save product');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async (slug) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filterParam === 'low_stock' && p.stock > 10) return false;
    return (
      !searchTerm ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Products Catalog</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            {filterParam === 'low_stock' ? (
              <span style={{ color: '#dc2626', fontWeight: 700 }}>
                Filtering: Products with low inventory stock (&le; 10 items)
              </span>
            ) : (
              `Manage store catalog, pricing, variants, and stock (${products.length} products)`
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '13px',
              width: '220px',
              outline: 'none',
            }}
          />

          <button
            type="button"
            onClick={openAddModal}
            style={{
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            <i className="ri-add-line"></i> Add New Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-table-card">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>No products found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand / Category</th>
                  <th>Regular Price</th>
                  <th>Selling Price</th>
                  <th>Discount</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={prod.primaryImage || prod.images?.[0]}
                          alt={prod.title}
                          style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div>
                          <p style={{ fontWeight: 800, color: '#0f172a', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prod.title}
                          </p>
                          {prod.sku && <span style={{ fontSize: '11px', color: '#64748b' }}>SKU: {prod.sku}</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#4f46e5' }}>{prod.brand || 'NEW LOOK_Z'}</span>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{prod.category}</div>
                    </td>
                    <td>৳ {prod.regularPrice}</td>
                    <td>
                      <b style={{ color: '#000000' }}>৳ {prod.sellingPrice}</b>
                    </td>
                    <td>
                      {prod.discountPercentage > 0 ? (
                        <span className="discount-badge" style={{ position: 'static' }}>
                          -{prod.discountPercentage}%
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: prod.stock <= 10 ? '#ef4444' : '#10b981',
                        }}
                      >
                        {prod.stock} in stock
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: prod.isActive ? '#d1fae5' : '#fee2e2',
                          color: prod.isActive ? '#065f46' : '#991b1b',
                        }}
                      >
                        {prod.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(prod)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            background: '#f1f5f9',
                            fontSize: '12px',
                            fontWeight: 700,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod.slug)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            fontSize: '12px',
                            fontWeight: 700,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="vp-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="vp-dialog"
            style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button type="button" className="nav-action-btn" onClick={() => setModalOpen(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Product Title <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mens Casual Linen Shirt"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
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

              {/* Brand & Category row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Brand / Manufacturer
                  </label>
                  <select
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
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
                    <option value="">-- Select Brand --</option>
                    {brands.map((b) => (
                      <option key={b.slug} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={form.categorySlug}
                    onChange={handleCategoryChange}
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
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Subcategory Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shirts, Pants..."
                    value={form.subcategory}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        subcategory: e.target.value,
                        subcategorySlug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
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

              {/* Automatic Colors Selection Grid */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>
                  Available Colors (Automatically applies color swatches & dots)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {colorsList.map((col) => {
                    const isSelected = selectedColors.includes(col.name);
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => toggleColorSelect(col.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          background: isSelected ? '#000000' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#334155',
                          border: isSelected ? '1.5px solid #000000' : '1px solid #cbd5e1',
                          fontSize: '12px',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: col.code,
                            border: '1px solid #cbd5e1',
                            display: 'inline-block',
                          }}
                        ></span>
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Available Sizes Selection */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>
                  Available Sizes
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size', '38', '39', '40', '41', '42', '43', '44'].map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSizeSelect(sz)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          background: isSelected ? '#000000' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#334155',
                          border: isSelected ? '1.5px solid #000000' : '1px solid #cbd5e1',
                          fontSize: '12px',
                          fontWeight: isSelected ? 800 : 600,
                          cursor: 'pointer',
                        }}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pricing & Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Regular Price (৳)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1500"
                    value={form.regularPrice}
                    onChange={(e) => setForm({ ...form, regularPrice: e.target.value })}
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
                    Selling Price (৳) <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1200"
                    value={form.sellingPrice}
                    onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
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
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
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
                  Primary Image URL <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={form.primaryImage}
                  onChange={(e) => setForm({ ...form, primaryImage: e.target.value })}
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
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed product information..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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

              {/* Promo tags checkboxes */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={form.isNewArrival}
                    onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
                  />
                  New Arrival
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={form.isTopSelling}
                    onChange={(e) => setForm({ ...form, isTopSelling: e.target.checked })}
                  />
                  Top Selling
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={form.isTrending}
                    onChange={(e) => setForm({ ...form, isTrending: e.target.checked })}
                  />
                  Trending
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  />
                  Featured
                </label>
              </div>

              <button
                type="submit"
                className="btn-checkout"
                style={{ width: '100%', padding: '14px', borderRadius: '8px', marginTop: '10px' }}
              >
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading products...</div>}>
      <AdminProductsContent />
    </Suspense>
  );
}
