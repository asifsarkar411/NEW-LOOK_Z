'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [openDropdowns, setOpenDropdowns] = useState({
    orders: true,
    products: true,
    purchases: false,
    reports: false,
    marketing: false,
    blog: false,
    access: false,
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

    if (pathname.includes('/admin/orders')) setOpenDropdowns((p) => ({ ...p, orders: true }));
    if (
      pathname.includes('/admin/products') ||
      pathname.includes('/admin/categories') ||
      pathname.includes('/admin/brands') ||
      pathname.includes('/admin/colors')
    )
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
      icon: 'ri-dashboard-3-line',
      iconBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    },
    {
      type: 'dropdown',
      key: 'orders',
      label: 'Orders Management',
      icon: 'ri-shopping-bag-3-line',
      iconBg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
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
      label: 'Catalog & Inventory',
      icon: 'ri-shirt-line',
      iconBg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      subitems: [
        { label: 'All Products', href: '/admin/products' },
        { label: 'Add New Product', href: '/admin/products?action=new' },
        { label: 'Low Stock Alert', href: '/admin/products?filter=low_stock' },
        { label: 'Categories & Subcategories', href: '/admin/categories' },
        { label: 'Brands Management', href: '/admin/brands' },
        { label: 'Colors & Swatches', href: '/admin/colors' },
      ],
    },
    {
      type: 'dropdown',
      key: 'purchases',
      label: 'Purchases (Stock)',
      icon: 'ri-archive-drawer-line',
      iconBg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
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
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
    },
    {
      type: 'dropdown',
      key: 'reports',
      label: 'Reports & Analytics',
      icon: 'ri-bar-chart-box-line',
      iconBg: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
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
      iconBg: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
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
      iconBg: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
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
      iconBg: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
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
      iconBg: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
    },
  ];

  return (
    <div className="admin-layout" style={{ background: '#f1f5f9', minHeight: '100vh' }}>
      {/* Dynamic Colorful Modern Sidebar */}
      <aside
        className="admin-sidebar"
        style={{
          width: '280px',
          background: 'linear-gradient(180deg, #0b0f19 0%, #111827 50%, #1e1b4b 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '24px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '20px',
              boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)',
            }}
          >
            Z
          </div>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.3px' }}>
              NEW LOOK_Z
            </h2>
            <span
              style={{
                fontSize: '10px',
                color: '#a5b4fc',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                fontWeight: 700,
              }}
            >
              Enterprise Admin
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="admin-nav" style={{ padding: '16px 12px 30px', flex: 1 }}>
          {navigationItems.map((item) => {
            if (item.type === 'single') {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)'
                      : 'transparent',
                    border: isActive ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13.5px',
                    marginBottom: '4px',
                    transition: 'all 0.15s ease',
                  }}
                  className="admin-nav-item"
                >
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: item.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '15px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    <i className={item.icon}></i>
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            }

            const isOpen = openDropdowns[item.key];
            const isParentActive = item.subitems.some((sub) => pathname === sub.href.split('?')[0]);

            return (
              <div key={item.key} style={{ marginBottom: '4px' }}>
                <button
                  type="button"
                  onClick={() => toggleDropdown(item.key)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    color: isParentActive ? '#ffffff' : '#cbd5e1',
                    background: isParentActive
                      ? 'rgba(255, 255, 255, 0.06)'
                      : 'transparent',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13.5px',
                    fontWeight: isParentActive ? 700 : 500,
                    transition: 'all 0.15s ease',
                  }}
                  className="admin-nav-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: item.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '15px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      }}
                    >
                      <i className={item.icon}></i>
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <i
                    className="ri-arrow-down-s-line"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      fontSize: '16px',
                      color: '#94a3b8',
                    }}
                  ></i>
                </button>

                {isOpen && (
                  <div
                    style={{
                      paddingLeft: '38px',
                      paddingTop: '4px',
                      paddingBottom: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    {item.subitems.map((sub) => {
                      const isSubActive = pathname === sub.href.split('?')[0];
                      return (
                        <Link
                          key={sub.label + sub.href}
                          href={sub.href}
                          style={{
                            display: 'block',
                            padding: '6px 12px',
                            fontSize: '12.5px',
                            borderRadius: '6px',
                            color: isSubActive ? '#a5b4fc' : '#94a3b8',
                            background: isSubActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                            fontWeight: isSubActive ? 700 : 400,
                            transition: 'all 0.15s ease',
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

          {/* Bottom Actions */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <Link
              href="/"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                color: '#38bdf8',
                fontSize: '13px',
                fontWeight: 600,
                background: 'rgba(56, 189, 248, 0.08)',
              }}
            >
              <i className="ri-external-link-line"></i>
              <span>View Storefront</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '13px',
                fontWeight: 600,
                background: 'rgba(239, 68, 68, 0.08)',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <i className="ri-logout-box-r-line"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Admin Content & Clean Topbar */}
      <div className="admin-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          className="admin-topbar"
          style={{
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#6366f1', letterSpacing: '0.8px' }}>
              Management Console
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
              NEW LOOK_Z Portal
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '15px',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                }}
              >
                {adminUser?.name?.[0] || 'A'}
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {adminUser?.name || 'Administrator'}
                </p>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {adminUser?.email || 'admin@example.com'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content" style={{ padding: '32px', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
