'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function HomeProductSection({ title, subtitle, products = [], viewAllLink = '/shop' }) {
  const [activeTab, setActiveTab] = useState('all');

  // Extract unique subcategories or categories for the tabs
  const subcategories = Array.from(
    new Set(
      products
        .map((p) => p.subcategory || p.category)
        .filter(Boolean)
    )
  );

  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter(
          (p) =>
            (p.subcategory && p.subcategory.toLowerCase() === activeTab.toLowerCase()) ||
            (p.category && p.category.toLowerCase() === activeTab.toLowerCase())
        );

  return (
    <section className="sf-section">
      <div className="sf-container">
        <div className="product-section-header">
          <div className="product-section-title">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
        </div>

        {/* Category Tabs */}
        {subcategories.length > 0 && (
          <div className="section-tabs" role="tablist">
            <button
              type="button"
              className={`section-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                className={`section-tab-btn ${
                  activeTab.toLowerCase() === sub.toLowerCase() ? 'active' : ''
                }`}
                onClick={() => setActiveTab(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div className="sf-product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.slug} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No products found in this category.
          </div>
        )}

        {/* See all button */}
        <div className="sf-section-cta">
          <Link href={viewAllLink} className="btn-see-all">
            See All <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
