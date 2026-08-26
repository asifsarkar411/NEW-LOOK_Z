'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

export default function ShopCatalog({
  initialProducts = [],
  categories = [],
  currentCategory = '',
  currentSubcategory = '',
  currentSearch = '',
  currentSort = 'latest',
}) {
  const router = useRouter();
  const [maxPrice, setMaxPrice] = useState(3000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleSortChange = (e) => {
    const sortVal = e.target.value;
    const url = new URL(window.location.href);
    url.searchParams.set('sort', sortVal);
    router.push(url.pathname + url.search);
  };

  const filteredProducts = initialProducts.filter(
    (p) => p.sellingPrice <= maxPrice
  );

  return (
    <div className="sf-section" style={{ paddingTop: '30px' }}>
      <div className="sf-container">
        {/* Breadcrumb & Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
            <Link href="/">Home</Link> &nbsp;/&nbsp; <Link href="/shop">Shop</Link>
            {currentCategory && (
              <>
                &nbsp;/&nbsp; <span style={{ color: '#000000', fontWeight: 600 }}>{currentCategory}</span>
              </>
            )}
            {currentSearch && (
              <>
                &nbsp;/&nbsp; <span style={{ color: '#000000', fontWeight: 600 }}>Search: &quot;{currentSearch}&quot;</span>
              </>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 900 }}>
                {currentCategory
                  ? categories.find((c) => c.slug === currentCategory)?.name || currentCategory
                  : currentSearch
                  ? `Search Results for "${currentSearch}"`
                  : 'All Collection'}
              </h1>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                Showing {filteredProducts.length} items
              </p>
            </div>

            {/* Sort & Mobile Filter toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select
                value={currentSort}
                onChange={handleSortChange}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1.5px solid #e2e8f0',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                  background: '#ffffff',
                }}
              >
                <option value="latest">Sort by: Latest</option>
                <option value="popular">Sort by: Popularity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2 Column Layout: Sidebar + Products */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }}>
          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Category Filter */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>
                Categories
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Link
                  href="/shop"
                  style={{
                    fontSize: '14px',
                    fontWeight: !currentCategory ? 800 : 500,
                    color: !currentCategory ? '#000000' : '#475569',
                    padding: '6px 0',
                  }}
                >
                  All Categories
                </Link>

                {categories.map((cat) => (
                  <div key={cat.slug}>
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '14px',
                        fontWeight: currentCategory === cat.slug ? 800 : 500,
                        color: currentCategory === cat.slug ? '#000000' : '#475569',
                        padding: '6px 0',
                      }}
                    >
                      <span>{cat.name}</span>
                      {cat.subcategories?.length > 0 && (
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          ({cat.subcategories.length})
                        </span>
                      )}
                    </Link>

                    {/* Subcategories if category is active */}
                    {currentCategory === cat.slug && (
                      <div style={{ paddingLeft: '12px', marginBottom: '8px' }}>
                        {cat.subcategories?.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                            style={{
                              display: 'block',
                              fontSize: '13px',
                              padding: '4px 0',
                              color: currentSubcategory === sub.slug ? '#000000' : '#64748b',
                              fontWeight: currentSubcategory === sub.slug ? 700 : 400,
                            }}
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>
                Max Price: ৳ {maxPrice}
              </h3>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#000000' }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#64748b',
                  marginTop: '8px',
                }}
              >
                <span>৳ 100</span>
                <span>৳ 3,000</span>
              </div>
            </div>

            {/* Promo banner in sidebar */}
            <div
              style={{
                background: '#000000',
                color: '#ffffff',
                borderRadius: '12px',
                padding: '24px 20px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#e11d48' }}>SPECIAL DEAL</span>
              <h4 style={{ fontSize: '18px', fontWeight: 900, margin: '8px 0' }}>Get 25% Off</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '14px' }}>
                Use code <b>SAVE25</b> at checkout
              </p>
              <Link
                href="/shop"
                className="btn-see-all"
                style={{ background: '#ffffff', color: '#000000', border: 'none', width: '100%', justifyContent: 'center' }}
              >
                Shop Now
              </Link>
            </div>
          </aside>

          {/* Product Grid */}
          <main>
            {filteredProducts.length > 0 ? (
              <div className="sf-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  background: '#f8fafc',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <i
                  className="ri-search-line"
                  style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '12px', display: 'block' }}
                ></i>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
                  No products matched your criteria
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                  Try adjusting your filters or search terms.
                </p>
                <Link href="/shop" className="btn-see-all">
                  Reset All Filters
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
