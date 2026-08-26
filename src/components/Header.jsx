'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function Header({ categories = [], marqueeText = '' }) {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, wishlistCount, setIsCartOpen } = useStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [openMobileCategories, setOpenMobileCategories] = useState({});

  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const desktopSearchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setDrawerOpen(false);
    setCategoriesOpen(false);
    setShopOpen(false);
    setDesktopSearchOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  // Debounced search suggestions
  useEffect(() => {
    const term = searchTerm.trim();
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.products || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setDesktopSearchOpen(false);
      setMobileSearchOpen(false);
    }
  };

  const toggleMobileCategory = (index) => {
    setOpenMobileCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const topMarquee =
    marqueeText ||
    'Get 25% off on your purchase! Use this coupon code SAVE25 on the Checkout Page';

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="sf-topbar">
        <marquee behavior="scroll" direction="left" scrollamount="6">
          <b>{topMarquee}</b>
        </marquee>
      </div>

      {/* Main Navbar */}
      <nav className="compact-navbar">
        <div className="nav-container">
          {/* Left: Mobile Drawer Trigger & Desktop Links */}
          <div className="nav-left">
            <button
              type="button"
              className="mobile-menu-btn nav-action-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              style={{ display: 'none' }}
            >
              <i className="ri-menu-2-line"></i>
            </button>

            <div className="desktop-nav-links">
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                <i className="ri-home-line"></i>
                <span>Home</span>
              </Link>

              {/* Categories Mega Dropdown */}
              <div
                className="nav-link-dropdown"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <Link
                  href="/categories"
                  className={`nav-link ${pathname.startsWith('/categories') ? 'active' : ''}`}
                >
                  <i className="ri-apps-2-line"></i>
                  <span>Categories</span>
                  <i className="ri-arrow-down-s-line" style={{ fontSize: '14px' }}></i>
                </Link>

                {categoriesOpen && categories.length > 0 && (
                  <div className="categories-dropdown">
                    <div className="categories-dropdown-container">
                      {/* Left list of categories */}
                      <div className="categories-column">
                        {categories.map((cat, idx) => (
                          <div
                            key={cat.slug || idx}
                            className={`category-menu-item ${activeCategory === idx ? 'active' : ''}`}
                            onMouseEnter={() => setActiveCategory(idx)}
                          >
                            <span>{cat.name}</span>
                            <i className="ri-arrow-right-s-line"></i>
                          </div>
                        ))}
                      </div>

                      {/* Right Subcategories preview */}
                      <div className="subcategories-column">
                        {categories[activeCategory] && (
                          <div>
                            <div className="subcategories-header">
                              <div className="subcategories-header-left">
                                {categories[activeCategory].image && (
                                  <img
                                    src={categories[activeCategory].image}
                                    alt={categories[activeCategory].name}
                                  />
                                )}
                                <h4 style={{ fontWeight: 800 }}>{categories[activeCategory].name}</h4>
                              </div>
                              <Link
                                href={`/shop?category=${categories[activeCategory].slug}`}
                                className="btn-see-all"
                                style={{ padding: '4px 12px', fontSize: '12px' }}
                              >
                                View All <i className="ri-arrow-right-line"></i>
                              </Link>
                            </div>

                            <div className="subcategories-grid">
                              {categories[activeCategory].subcategories?.map((sub) => (
                                <Link
                                  key={sub.slug}
                                  href={`/shop?category=${categories[activeCategory].slug}&subcategory=${sub.slug}`}
                                  className="subcategory-item"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shop Dropdown */}
              <div
                className="nav-link-dropdown"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <Link
                  href="/shop"
                  className={`nav-link ${pathname === '/shop' ? 'active' : ''}`}
                >
                  <i className="ri-store-2-line"></i>
                  <span>Shop</span>
                  <i className="ri-arrow-down-s-line" style={{ fontSize: '14px' }}></i>
                </Link>

                {shopOpen && (
                  <div className="shop-dropdown">
                    <div className="shop-dropdown-container">
                      <div className="shop-column">
                        <h4>New Arrival</h4>
                        <Link href="/shop?sort=latest" className="shop-product-item">
                          <i className="ri-sparkling-fill" style={{ color: '#e11d48' }}></i>
                          <div className="shop-product-info">
                            <span className="title">Latest Collections</span>
                            <span className="price">New Seasons</span>
                          </div>
                        </Link>
                        <Link href="/shop?category=face-mask" className="shop-product-item">
                          <i className="ri-shield-check-line"></i>
                          <div className="shop-product-info">
                            <span className="title">Cotton Face Masks</span>
                            <span className="price">From ৳150</span>
                          </div>
                        </Link>
                      </div>

                      <div className="shop-column">
                        <h4>Top Selling</h4>
                        <Link href="/shop?sort=popular" className="shop-product-item">
                          <i className="ri-fire-fill" style={{ color: '#f59e0b' }}></i>
                          <div className="shop-product-info">
                            <span className="title">Most Loved Products</span>
                            <span className="price">Best Deals</span>
                          </div>
                        </Link>
                        <Link href="/shop?category=belts" className="shop-product-item">
                          <i className="ri-vip-diamond-line"></i>
                          <div className="shop-product-info">
                            <span className="title">Leather Belts & Wallets</span>
                            <span className="price">From ৳690</span>
                          </div>
                        </Link>
                      </div>

                      <div className="shop-column">
                        <h4>Trending</h4>
                        <Link href="/shop?category=mens-fashion" className="shop-product-item">
                          <i className="ri-shirt-line"></i>
                          <div className="shop-product-info">
                            <span className="title">Mens Casual & Linen</span>
                            <span className="price">From ৳1,150</span>
                          </div>
                        </Link>
                        <Link href="/shop?category=caps" className="shop-product-item">
                          <i className="ri-vip-crown-line"></i>
                          <div className="shop-product-info">
                            <span className="title">Classic Black Caps</span>
                            <span className="price">From ৳350</span>
                          </div>
                        </Link>
                      </div>

                      <div className="shop-column">
                        <h4>Special Offers</h4>
                        <Link href="/shop" className="shop-product-item">
                          <i className="ri-coupon-3-line" style={{ color: '#10b981' }}></i>
                          <div className="shop-product-info">
                            <span className="title">Use Code: SAVE25</span>
                            <span className="price">Flat 25% Off</span>
                          </div>
                        </Link>
                        <Link href="/shop?category=mens-shoes" className="shop-product-item">
                          <i className="ri-footprint-line"></i>
                          <div className="shop-product-info">
                            <span className="title">Mens Sneakers & Shoes</span>
                            <span className="price">From ৳1,800</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/blog" className={`nav-link ${pathname.startsWith('/blog') ? 'active' : ''}`}>
                <i className="ri-article-line"></i>
                <span>Blog</span>
              </Link>
            </div>
          </div>

          {/* Center: Brand Logo */}
          <div className="nav-center">
            <Link href="/" className="nav-logo">
              <span className="brand-logo-text">NEW LOOK_Z</span>
              <span className="brand-badge">STORE</span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="nav-right">
            {/* Desktop Search Toggle */}
            <button
              type="button"
              className="desktop-search-btn nav-action-btn"
              onClick={() => {
                setDesktopSearchOpen(!desktopSearchOpen);
                setTimeout(() => desktopSearchInputRef.current?.focus(), 100);
              }}
              aria-label="Search"
            >
              <i className="ri-search-line"></i>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="nav-action-btn wishlist-btn" title="Wishlist">
              <i className="ri-heart-line"></i>
              {wishlistCount > 0 && <span className="action-counter">{wishlistCount}</span>}
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              className="nav-action-btn cart-btn"
              title="Cart"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
            >
              <i className="ri-shopping-bag-line"></i>
              {cartCount > 0 && <span className="action-counter">{cartCount}</span>}
            </button>

            {/* Order Tracking */}
            <Link href="/track-order" className="nav-action-btn track-btn" title="Track order">
              <i className="ri-box-3-line"></i>
            </Link>

            {/* Account / Admin portal */}
            <Link href="/admin" className="nav-action-btn account-btn" title="Admin / Account">
              <i className="ri-user-line"></i>
            </Link>
          </div>
        </div>

        {/* Desktop Search Slide Down */}
        {desktopSearchOpen && (
          <div className="desktop-search-bar">
            <div className="desktop-search-container">
              <form onSubmit={handleSearchSubmit} className="nav-search-form">
                <input
                  ref={desktopSearchInputRef}
                  type="text"
                  placeholder="Search products by title, category, keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" aria-label="Search">
                  <i className="ri-search-line"></i>
                </button>
              </form>

              <button
                type="button"
                className="nav-action-btn"
                onClick={() => setDesktopSearchOpen(false)}
                aria-label="Close search"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            {suggestions.length > 0 && (
              <div className="desktop-search-suggestions">
                {suggestions.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/shop/${item.slug}`}
                    className="nav-suggestion-item"
                    onClick={() => setDesktopSearchOpen(false)}
                  >
                    <img src={item.primaryImage || item.image} alt={item.title} />
                    <div className="nav-suggestion-info">
                      <span className="nav-suggestion-title">{item.title}</span>
                      <span className="nav-price">৳ {item.sellingPrice || item.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="mobile-search-overlay"
          style={{ padding: 0 }}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="mobile-menu-content"
            style={{
              width: '300px',
              height: '100%',
              background: '#ffffff',
              padding: '24px 20px',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <span className="brand-logo-text" style={{ fontSize: '18px' }}>
                NEW LOOK_Z
              </span>
              <button
                type="button"
                className="nav-action-btn"
                onClick={() => setDrawerOpen(false)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/" className="nav-link" onClick={() => setDrawerOpen(false)}>
                <i className="ri-home-line"></i> Home
              </Link>
              <Link href="/shop" className="nav-link" onClick={() => setDrawerOpen(false)}>
                <i className="ri-store-2-line"></i> Shop All Products
              </Link>
              <Link href="/categories" className="nav-link" onClick={() => setDrawerOpen(false)}>
                <i className="ri-apps-2-line"></i> All Categories
              </Link>

              <div style={{ marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    marginBottom: '8px',
                  }}
                >
                  Featured Categories
                </p>
                {categories.map((cat, idx) => (
                  <div key={cat.slug || idx} style={{ marginBottom: '6px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: '#f8fafc',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                      onClick={() => toggleMobileCategory(idx)}
                    >
                      <span>{cat.name}</span>
                      <i
                        className={
                          openMobileCategories[idx]
                            ? 'ri-arrow-down-s-line'
                            : 'ri-arrow-right-s-line'
                        }
                      ></i>
                    </div>

                    {openMobileCategories[idx] && (
                      <div style={{ paddingLeft: '14px', marginTop: '4px' }}>
                        {cat.subcategories?.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                            style={{
                              display: 'block',
                              padding: '6px 0',
                              fontSize: '13px',
                              color: '#64748b',
                            }}
                            onClick={() => setDrawerOpen(false)}
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <Link href="/track-order" className="nav-link" onClick={() => setDrawerOpen(false)}>
                  <i className="ri-box-3-line"></i> Track Order
                </Link>
                <Link href="/blog" className="nav-link" onClick={() => setDrawerOpen(false)}>
                  <i className="ri-article-line"></i> Blog & Updates
                </Link>
                <Link href="/admin" className="nav-link" onClick={() => setDrawerOpen(false)}>
                  <i className="ri-lock-line"></i> Admin Console
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
