'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Track which dropdowns are expanded
  const [openDropdowns, setOpenDropdowns] = useState({
    orders: true,
    products: true,
    purchases: false,
    reports: false,
    marketing: false,
    blog: false,
    access: false,
    settings: false,
  });

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');

    if (!token && !isLoginPage) {
      router.push('/admin/login');
    } else if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch (e) {}
    }

    // Auto-open parent dropdown based on current pathname
    if (pathname.includes('/admin/orders')) setOpenDropdowns((p) => ({ ...p, orders: true }));
    if (pathname.includes('/admin/products') || pathname.includes('/admin/categories'))
      setOpenDropdowns((p) => ({ ...p, products: true }));
    if (pathname.includes('/admin/purchases')) setOpenDropdowns((p) => ({ ...p, purchases: true }));
    if (pathname.includes('/admin/reports')) setOpenDropdowns((p) => ({ ...p, reports: true }));
    if (pathname.includes('/admin/banners') || pathname.includes('/admin/coupons'))
      setOpenDropdowns((p) => ({ ...p, marketing: true }));
    if (pathname.includes('/admin/blogs')) setOpenDropdowns((p) => ({ ...p, blog: true }));
    if (
      pathname.includes('/admin/users') ||
      pathname.includes('/admin/roles') ||
      pathname.includes('/admin/security')
    )
      setOpenDropdowns((p) => ({ ...p, access: true }));
  }, [pathname, isLoginPage, router]);

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!mounted) return null;

  const navigationItems = [
    {
      type: 'single',
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: 'ri-dashboard-line',
    },
    {
      type: 'dropdown',
      key: 'orders',
      label: 'Orders Management',
      icon: 'ri-shopping-bag-3-line',
      subitems: [
        { label: 'All Orders', href: '/admin/orders' },
        { label: 'Pending Orders', href: '/admin/orders?status=pending' },
        { label: 'Confirmed Orders', href: '/admin/orders?status=confirmed' },
        { label: 'Processing Orders', href: '/admin/orders?status=processing' },
        { label: 'Shipped Orders', href: '/admin/orders?status=shipped' },
        { label: 'Delivered Orders', href: '/admin/orders?status=delivered' },
        { label: 'Cancelled Orders', href: '/admin/orders?status=cancelled' },
      ],
    },
    {
      type: 'dropdown',
      key: 'products',
      label: 'Products & Inventory',
      icon: 'ri-shirt-line',
      subitems: [
        { label: 'All Products', href: '/admin/products' },
        { label: 'Add New Product', href: '/admin/products?action=new' },
        { label: 'Low Stock Alert', href: '/admin/products?filter=low_stock' },
        { label: 'Categories & Tags', href: '/admin/categories' },
      ],
    },
    {
      type: 'dropdown',
      key: 'purchases',
      label: 'Purchases (Stock)',
      icon: 'ri-archive-drawer-line',
      subitems: [
        { label: 'Purchase History', href: '/admin/purchases' },
        { label: 'New Stock Inward', href: '/admin/purchases?action=new' },
      ],
    },
    {
      type: 'single',
      label: 'Customer CRM',
      href: '/admin/customers',
      icon: 'ri-user-star-line',
    },
    {
      type: 'dropdown',
      key: 'reports',
      label: 'Reports & Analytics',
      icon: 'ri-bar-chart-box-line',
      subitems: [
        { label: 'Financial Overview', href: '/admin/reports' },
        { label: 'Top Selling Products', href: '/admin/reports?tab=top_selling' },
        { label: 'Revenue Trends', href: '/admin/reports?tab=monthly' },
      ],
    },
    {
      type: 'dropdown',
      key: 'marketing',
      label: 'Marketing & Promos',
      icon: 'ri-coupon-3-line',
      subitems: [
        { label: 'Hero Banners & Slider', href: '/admin/banners' },
        { label: 'Announcement Marquee', href: '/admin/banners' },
        { label: 'Discount Coupons', href: '/admin/coupons' },
      ],
    },
    {
      type: 'dropdown',
      key: 'blog',
      label: 'Blog & Style Guides',
      icon: 'ri-article-line',
      subitems: [
        { label: 'All Blog Posts', href: '/admin/blogs' },
        { label: 'Write New Article', href: '/admin/blogs?action=new' },
      ],
    },
    {
      type: 'dropdown',
      key: 'access',
      label: 'Staff & Security',
      icon: 'ri-shield-user-line',
      subitems: [
        { label: 'Staff Users', href: '/admin/users' },
        { label: 'Roles & Permissions', href: '/admin/roles' },
        { label: 'Security & Audit Logs', href: '/admin/security' },
      ],
    },
    {
      type: 'single',
      label: 'Store Settings',
      href: '/admin/settings',
      icon: 'ri-settings-3-line',
    },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ width: '280px', overflowY: 'auto' }}>
        <div className="admin-sidebar-header">
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: '#ffffff',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '18px',
            }}
          >
            Z
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>NEW LOOK_Z</h2>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Management Console
            </span>
          </div>
        </div>

        <nav className="admin-nav" style={{ paddingBottom: '30px' }}>
          {navigationItems.map((item) => {
            if (item.type === 'single') {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-item ${isActive ? 'active' : ''}`}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
              );
            }

            // Dropdown Accordion Item
            const isOpen = openDropdowns[item.key];
            const isParentActive = item.subitems.some((sub) => pathname === sub.href.split('?')[0]);

            return (
              <div key={item.key} style={{ marginBottom: '4px' }}>
                <button
                  type="button"
                  onClick={() => toggleDropdown(item.key)}
                  className={`admin-nav-item ${isParentActive ? 'parent-active' : ''}`}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isParentActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </div>
                  <i
                    className={`ri-arrow-down-s-line`}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      fontSize: '16px',
                    }}
                  ></i>
                </button>

                {isOpen && (
                  <div
                    style={{
                      paddingLeft: '34px',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    {item.subitems.map((sub) => {
                      return (
                        <Link
                          key={sub.label + sub.href}
                          href={sub.href}
                          style={{
                            display: 'block',
                            padding: '7px 12px',
                            fontSize: '12.5px',
                            borderRadius: '6px',
                            color: '#94a3b8',
                            transition: 'all 0.15s ease',
                            fontWeight: 500,
                          }}
                          className="admin-subnav-link"
                        >
                          • {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1e293b' }}>
            <Link href="/" target="_blank" className="admin-nav-item">
              <i className="ri-external-link-line"></i>
              <span>View Storefront</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="admin-nav-item"
              style={{ width: '100%', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <i className="ri-logout-box-r-line"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Admin Content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Store Management Console
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                {adminUser?.name?.[0] || 'A'}
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.2 }}>
                  {adminUser?.name || 'Administrator'}
                </p>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {adminUser?.email || 'admin@example.com'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
