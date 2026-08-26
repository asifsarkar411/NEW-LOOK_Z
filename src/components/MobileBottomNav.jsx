'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useStore();

  return (
    <nav className="bottom-nav-mobile" aria-label="Mobile navigation">
      <ul>
        <li>
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            <i className="ri-home-line"></i>
            <p>Home</p>
          </Link>
        </li>
        <li>
          <Link href="/categories" className={pathname.startsWith('/categories') ? 'active' : ''}>
            <i className="ri-apps-line"></i>
            <p>Categories</p>
          </Link>
        </li>
        <li>
          <Link href="/shop" className={pathname === '/shop' ? 'active' : ''}>
            <i className="ri-store-2-line"></i>
            <p>Shop</p>
          </Link>
        </li>
        <li>
          <a
            role="button"
            tabIndex={0}
            onClick={() => setIsCartOpen(true)}
            style={{ position: 'relative' }}
          >
            <i className="ri-shopping-bag-line"></i>
            {cartCount > 0 && <span className="action-counter">{cartCount}</span>}
            <p>Cart</p>
          </a>
        </li>
        <li>
          <Link href="/admin" className={pathname.startsWith('/admin') ? 'active' : ''}>
            <i className="ri-user-line"></i>
            <p>Account</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
