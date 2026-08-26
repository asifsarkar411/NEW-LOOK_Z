'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [mounted, setMounted] = useState(false);

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
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!mounted) return null;

  const navGroups = [
    {
      group: 'Core Operations',
      items: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: 'ri-dashboard-line' },
        { label: 'Orders', href: '/admin/orders', icon: 'ri-shopping-bag-3-line' },
        { label: 'Products', href: '/admin/products', icon: 'ri-shirt-line' },
        { label: 'Purchases (Stock)', href: '/admin/purchases', icon: 'ri-archive-drawer-line' },
        { label: 'Categories', href: '/admin/categories', icon: 'ri-apps-2-line' },
        { label: 'Customers', href: '/admin/customers', icon: 'ri-user-star-line' },
        { label: 'Reports & Analytics', href: '/admin/reports', icon: 'ri-bar-chart-box-line' },
      ],
    },
    {
      group: 'Marketing & Content',
      items: [
        { label: 'Blogs & Guides', href: '/admin/blogs', icon: 'ri-article-line' },
        { label: 'Banners & Marquee', href: '/admin/banners', icon: 'ri-image-line' },
        { label: 'Coupons & Deals', href: '/admin/coupons', icon: 'ri-coupon-3-line' },
      ],
    },
    {
      group: 'Access & Administration',
      items: [
        { label: 'Users & Staff', href: '/admin/users', icon: 'ri-team-line' },
        { label: 'Roles & Permissions', href: '/admin/roles', icon: 'ri-shield-user-line' },
        { label: 'Security & Logs', href: '/admin/security', icon: 'ri-lock-password-line' },
        { label: 'Store Settings', href: '/admin/settings', icon: 'ri-settings-3-line' },
      ],
    },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ width: '270px' }}>
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
              Enterprise Admin
            </span>
          </div>
        </div>

        <nav className="admin-nav" style={{ paddingBottom: '30px' }}>
          {navGroups.map((group) => (
            <div key={group.group} style={{ marginBottom: '16px' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '10px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#64748b',
                  letterSpacing: '0.8px',
                  padding: '6px 12px',
                }}
              >
                {group.group}
              </span>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #1e293b' }}>
            <Link href="/" target="_blank" className="admin-nav-item">
              <i className="ri-external-link-line"></i>
              <span>View Live Store</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="admin-nav-item"
              style={{ width: '100%', color: '#ef4444' }}
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
              Control & Management Suite
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
