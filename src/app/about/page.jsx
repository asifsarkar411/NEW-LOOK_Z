import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | NEW LOOK_Z',
  description: 'Learn more about NEW LOOK_Z, our vision, and our dedication to bringing modern fashion to Bangladesh.',
};

export default function AboutPage() {
  return (
    <div className="sf-section" style={{ paddingTop: '40px' }}>
      <div className="sf-container" style={{ maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#e11d48' }}>
            Our Story
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 900, marginTop: '4px' }}>About NEW LOOK_Z</h1>
          <p style={{ fontSize: '15px', color: '#64748b', marginTop: '8px' }}>
            Redefining contemporary style, everyday comfort, and high quality across Bangladesh.
          </p>
        </div>

        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '320px', marginBottom: '32px' }}>
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80"
            alt="Storefront"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ fontSize: '15px', color: '#334155', lineHeight: 1.8 }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
            Who We Are
          </h3>
          <p style={{ marginBottom: '20px' }}>
            Founded with a passion for quality and design, <b>NEW LOOK_Z</b> is a premier Bangladeshi lifestyle brand dedicated to bringing you trendsetting fashion, footwear, genuine leather goods, and accessories at accessible prices.
          </p>

          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
            Our Mission & Commitment
          </h3>
          <p style={{ marginBottom: '20px' }}>
            We believe that looking great shouldn’t come at the cost of comfort or affordability. Every piece in our catalog is meticulously sourced and tested for durability, fit, and authentic craftsmanship. Whether it’s breathable linen apparel or handcrafted leather accessories, we guarantee supreme satisfaction with every single order.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginTop: '36px',
            }}
          >
            <div style={{ padding: '20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>100% Quality Checked</h4>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Every item undergoes rigorous quality inspections prior to packaging.</p>
            </div>

            <div style={{ padding: '20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>Swift Courier Shipping</h4>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Fast doorstep delivery across all 64 districts in Bangladesh.</p>
            </div>

            <div style={{ padding: '20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>7-Day Easy Returns</h4>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Complete peace of mind with our straightforward return policy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
