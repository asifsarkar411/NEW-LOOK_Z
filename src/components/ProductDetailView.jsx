'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailView({ product, relatedProducts = [] }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const allImages = [
    product.primaryImage,
    ...(product.images || []).filter((img) => img !== product.primaryImage),
  ].filter(Boolean);

  const [activeImage, setActiveImage] = useState(allImages[0] || '');
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initial = {};
    product.axes?.forEach((axis) => {
      if (axis.values && axis.values.length > 0) {
        initial[axis.name] = axis.values[0].label;
      }
    });
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedMessage, setAddedMessage] = useState(false);

  const wish = isWishlisted(product._id || product.id);

  const handleSelectOption = (axisName, label) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [axisName]: label,
    }));
  };

  const isComplete =
    !product.axes ||
    product.axes.length === 0 ||
    product.axes.every((axis) => Boolean(selectedOptions[axis.name]));

  const getVariantDetails = () => {
    const variantLabel = Object.entries(selectedOptions)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    const matched = product.variants?.find((v) => {
      const opts = v.options instanceof Map ? Object.fromEntries(v.options) : v.options;
      if (!opts) return false;
      return Object.entries(selectedOptions).every(([axis, val]) => opts[axis] === val);
    });

    return { variantLabel, variantId: matched?.id || '' };
  };

  const handleAddToCart = () => {
    if (!isComplete) return;
    const { variantLabel, variantId } = getVariantDetails();
    addToCart(product, variantLabel, variantId, quantity);

    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  const handleBuyNow = () => {
    if (!isComplete) return;
    const { variantLabel, variantId } = getVariantDetails();
    addToCart(product, variantLabel, variantId, quantity);
    router.push('/checkout');
  };

  return (
    <div className="sf-section" style={{ paddingTop: '30px' }}>
      <div className="sf-container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
          <Link href="/">Home</Link> &nbsp;/&nbsp; <Link href="/shop">Shop</Link> &nbsp;/&nbsp;{' '}
          <Link href={`/shop?category=${product.categorySlug}`}>{product.category}</Link> &nbsp;/&nbsp;{' '}
          <span style={{ color: '#000000', fontWeight: 600 }}>{product.title}</span>
        </div>

        {/* 2 Column Product Stage: Gallery + Details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            marginBottom: '60px',
          }}
        >
          {/* Gallery */}
          <div>
            <div
              style={{
                width: '100%',
                aspectRatio: '1 / 1.1',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                marginBottom: '16px',
                position: 'relative',
              }}
            >
              <img
                src={activeImage || product.primaryImage}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {product.discountPercentage > 0 && (
                <span className="discount-badge" style={{ fontSize: '13px', padding: '5px 10px' }}>
                  -{product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: activeImage === img ? '2px solid #000000' : '1px solid #e2e8f0',
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div>
            <span
              style={{
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: 800,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                marginBottom: '8px',
              }}
            >
              {product.subcategory || product.category}
            </span>

            <h1 style={{ fontSize: '28px', fontWeight: 900, lineHeight: 1.3, marginBottom: '12px' }}>
              {product.title}
            </h1>

            {/* Rating and SKU */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
                fontSize: '13px',
                color: '#64748b',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                <span>{'★'.repeat(product.rating || 5)}</span>
                <span style={{ color: '#0f172a', fontWeight: 700, marginLeft: '4px' }}>
                  ({product.reviewCount || 24} Reviews)
                </span>
              </div>
              {product.sku && <span>SKU: {product.sku}</span>}
              <span style={{ color: '#10b981', fontWeight: 700 }}>● In Stock</span>
            </div>

            {/* Price Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px',
                padding: '16px 0',
                borderTop: '1px solid #f1f5f9',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '24px',
              }}
            >
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#000000' }}>
                ৳ {product.sellingPrice}
              </span>
              {product.regularPrice > product.sellingPrice && (
                <span style={{ fontSize: '18px', color: '#94a3b8', textDecoration: 'line-through' }}>
                  ৳ {product.regularPrice}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span
                  style={{
                    background: '#fee2e2',
                    color: '#e11d48',
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  Save ৳ {product.regularPrice - product.sellingPrice}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
              {product.shortDescription || product.description}
            </p>

            {/* Variant Axes Selection */}
            {product.axes?.map((axis) => {
              const isColor = axis.values.some((v) => v.swatch);
              return (
                <div key={axis.name} style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                    Select {axis.name}:{' '}
                    <span style={{ fontWeight: 800, color: '#000000' }}>
                      {selectedOptions[axis.name]}
                    </span>
                  </p>

                  {isColor ? (
                    <div className="color-grid">
                      {axis.values.map((v) => (
                        <div key={v.label} className="color-option">
                          <button
                            type="button"
                            className={`color-dot ${
                              selectedOptions[axis.name] === v.label ? 'is-selected' : ''
                            }`}
                            style={{ backgroundColor: v.swatch || '#000000' }}
                            onClick={() => handleSelectOption(axis.name, v.label)}
                          ></button>
                          <span
                            className={`color-name ${
                              selectedOptions[axis.name] === v.label ? 'is-selected' : ''
                            }`}
                          >
                            {v.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="vp-size-grid">
                      {axis.values.map((v) => (
                        <button
                          key={v.label}
                          type="button"
                          className={`vp-size-btn ${
                            selectedOptions[axis.name] === v.label ? 'is-selected' : ''
                          }`}
                          onClick={() => handleSelectOption(axis.name, v.label)}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quantity Selector */}
            <div style={{ marginBottom: '28px' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Quantity</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '8px' }}>
                <button
                  type="button"
                  style={{ padding: '8px 16px', fontSize: '16px', fontWeight: 700 }}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span style={{ padding: '8px 14px', fontSize: '14px', fontWeight: 800 }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  style={{ padding: '8px 16px', fontSize: '16px', fontWeight: 700 }}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions: Add to Cart, Buy Now, Wishlist */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                className="btn-see-all"
                style={{
                  background: '#f1f5f9',
                  color: '#0f172a',
                  border: 'none',
                  justifyContent: 'center',
                  padding: '14px',
                  borderRadius: '10px',
                }}
                onClick={handleAddToCart}
              >
                <i className="ri-shopping-cart-2-line" style={{ fontSize: '18px' }}></i> Add to Cart
              </button>

              <button
                type="button"
                className="btn-see-all"
                style={{
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  justifyContent: 'center',
                  padding: '14px',
                  borderRadius: '10px',
                }}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

              <button
                type="button"
                className={`icon-btn ${wish ? 'is-active' : ''}`}
                style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f8fafc' }}
                onClick={() => toggleWishlist(product)}
                title="Add to Wishlist"
              >
                <i className={wish ? 'ri-heart-fill' : 'ri-heart-line'} style={{ fontSize: '20px' }}></i>
              </button>
            </div>

            {addedMessage && (
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
                ✓ Product successfully added to cart!
              </div>
            )}

            {/* Highlights Box */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 20px',
                fontSize: '13px',
                color: '#475569',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ri-truck-line" style={{ color: '#000000' }}></i>
                <span>Fast home delivery across Bangladesh (Dhaka: ৳60, Outside: ৳120)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ri-shield-check-line" style={{ color: '#000000' }}></i>
                <span>100% Original Authentic Product with Quality Assurance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ri-coupon-3-line" style={{ color: '#000000' }}></i>
                <span>Use coupon <b>SAVE25</b> at checkout for 25% discount!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info: Description, Specifications, Shipping & Return */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '40px', marginBottom: '60px' }}>
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
            {['description', 'specifications', 'shipping'].map((tab) => (
              <button
                key={tab}
                type="button"
                style={{
                  padding: '12px 0',
                  fontSize: '16px',
                  fontWeight: activeTab === tab ? 800 : 500,
                  color: activeTab === tab ? '#000000' : '#64748b',
                  borderBottom: activeTab === tab ? '2px solid #000000' : '2px solid transparent',
                  textTransform: 'capitalize',
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'shipping' ? 'Shipping & Returns' : tab}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, maxWidth: '800px' }}>
            {activeTab === 'description' && (
              <div>
                <p style={{ marginBottom: '16px' }}>{product.description}</p>
                <p>
                  Crafted with precision to elevate your personal style. Designed for comfort, durability, and a sleek modern look for any occasion.
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <table style={{ width: '100%', maxWidth: '500px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 0', fontWeight: 700, color: '#0f172a' }}>Category</td>
                      <td style={{ padding: '8px 0' }}>{product.category}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 0', fontWeight: 700, color: '#0f172a' }}>Subcategory</td>
                      <td style={{ padding: '8px 0' }}>{product.subcategory || 'General'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 0', fontWeight: 700, color: '#0f172a' }}>SKU</td>
                      <td style={{ padding: '8px 0' }}>{product.sku || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 700, color: '#0f172a' }}>Availability</td>
                      <td style={{ padding: '8px 0', color: '#10b981', fontWeight: 700 }}>In Stock ({product.stock} items)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <p style={{ marginBottom: '12px' }}>
                  <b>Delivery Timeline:</b> Inside Dhaka within 24 to 48 hours. Outside Dhaka within 3 to 5 business days.
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <b>Return Policy:</b> Easy 7-day return policy in case of defect, wrong size, or dissatisfaction. Product must be in original condition with tags intact.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="product-section-header">
              <div className="product-section-title">
                <h2>You May Also Like</h2>
                <p>Complement your style with these handpicked related items</p>
              </div>
            </div>

            <div className="sf-product-grid">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id || rel.slug} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
