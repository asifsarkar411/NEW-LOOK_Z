'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import VariantPickerModal from '@/components/VariantPickerModal';
import FloatingActions from '@/components/FloatingActions';
import MobileBottomNav from '@/components/MobileBottomNav';

export default function StorefrontLayoutWrapper({ children, categories, setting }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Header categories={categories} marqueeText={setting.topbarMarquee} />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <Footer setting={setting} />
      <CartDrawer />
      <VariantPickerModal />
      <FloatingActions
        whatsapp={setting.whatsappNumber || '8801824416130'}
        phone={setting.phone || '+8801824416130'}
        email={setting.email || 'contact@newlookz.com'}
      />
      <MobileBottomNav />
    </>
  );
}
