import React from 'react';
import Link from 'next/link';

export function generateMetadata({ params }) {
  const titles = {
    'return-policy': 'Return & Refund Policy',
    'privacy-policy': 'Privacy Policy',
    'terms-conditions': 'Terms & Conditions',
  };
  const title = titles[params.slug] || 'Store Policy';
  return {
    title: `${title} | NEW LOOK_Z`,
  };
}

export default function PolicyPage({ params }) {
  const { slug } = params;

  const contentMap = {
    'return-policy': {
      title: 'Return & Exchange Policy',
      subtitle: 'Simple, hassle-free 7-day returns for customer peace of mind.',
      body: (
        <>
          <p>
            At <b>NEW LOOK_Z</b>, customer satisfaction is our highest priority. If you receive an item that is damaged, defective, or in an incorrect size/color, you may request an exchange or refund within <b>7 days</b> of receiving your shipment.
          </p>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '20px 0 10px' }}>Eligibility for Returns:</h3>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li>The product must be unworn, unwashed, and in its original brand packaging with all tags attached.</li>
            <li>Proof of purchase (Order ID or invoice receipt) is required.</li>
            <li>Items damaged due to customer misuse or altered are not eligible for return.</li>
          </ul>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '20px 0 10px' }}>How to Initiate a Return:</h3>
          <p>
            Simply contact our WhatsApp customer support team at <b>+880 1824-416130</b> or email us at <b>contact@newlookz.com</b> with your Order Number and photos of the item. Our logistics partner will schedule a pickup or provide replacement instructions.
          </p>
        </>
      ),
    },
    'privacy-policy': {
      title: 'Privacy Policy',
      subtitle: 'How we respect, safeguard, and protect your personal information.',
      body: (
        <>
          <p>
            We take your privacy seriously. This Privacy Policy describes how <b>NEW LOOK_Z</b> collects, uses, and protects the personal data you provide when browsing our store or placing an order.
          </p>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '20px 0 10px' }}>Information We Collect:</h3>
          <p>
            When placing an order, we collect your name, phone number, shipping address, and optional email address solely to fulfill and deliver your package. We do not sell or share your information with any unauthorized third parties.
          </p>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '20px 0 10px' }}>Security:</h3>
          <p>
            All connection data is encrypted using industry-standard SSL protocols, ensuring your sensitive details remain private and secure.
          </p>
        </>
      ),
    },
    'terms-conditions': {
      title: 'Terms & Conditions',
      subtitle: 'Terms governing purchases and storefront operations.',
      body: (
        <>
          <p>
            Welcome to <b>NEW LOOK_Z</b>. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '20px 0 10px' }}>Orders & Pricing:</h3>
          <p>
            All prices listed on the website are in Bangladeshi Taka (৳ BDT). While we strive for absolute accuracy, we reserve the right to correct typographical errors or cancel orders placed with incorrect pricing.
          </p>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '20px 0 10px' }}>Cash on Delivery (COD):</h3>
          <p>
            For COD orders, customers agree to pay the delivery courier upon arrival of the package at the designated address.
          </p>
        </>
      ),
    },
  };

  const item = contentMap[slug] || {
    title: 'Store Information',
    subtitle: 'Official documentation for NEW LOOK_Z.',
    body: <p>Please reach out to our support team for further inquiries.</p>,
  };

  return (
    <div className="sf-section" style={{ paddingTop: '40px' }}>
      <div className="sf-container" style={{ maxWidth: '800px' }}>
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          <Link href="/">Home</Link> &nbsp;/&nbsp; <span style={{ color: '#000000', fontWeight: 600 }}>Policy</span>
        </div>

        <h1 style={{ fontSize: '30px', fontWeight: 900, marginBottom: '8px' }}>{item.title}</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>{item.subtitle}</p>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '32px',
            fontSize: '15px',
            color: '#334155',
            lineHeight: 1.8,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {item.body}
        </div>
      </div>
    </div>
  );
}
