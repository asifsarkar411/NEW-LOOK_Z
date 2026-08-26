import React from 'react';
import Link from 'next/link';

export default function BlogPostDetail({ params }) {
  const { slug } = params;

  return (
    <div className="sf-section" style={{ paddingTop: '40px' }}>
      <div className="sf-container" style={{ maxWidth: '800px' }}>
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          <Link href="/">Home</Link> &nbsp;/&nbsp; <Link href="/blog">Blog</Link> &nbsp;/&nbsp;{' '}
          <span style={{ color: '#000000', fontWeight: 600 }}>Article</span>
        </div>

        <span
          style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#e11d48',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Style & Fashion Insight
        </span>

        <h1 style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1.3, margin: '8px 0 16px' }}>
          The Future of Fashion & Streetwear Trends in 2026
        </h1>

        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b', marginBottom: '28px' }}>
          <span>By <b>NEW LOOK_Z Editorial</b></span>
          <span>• August 2026</span>
          <span>• 4 min read</span>
        </div>

        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '380px', marginBottom: '32px' }}>
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80"
            alt="Blog banner"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ fontSize: '16px', color: '#334155', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '20px' }}>
            Fashion in 2026 is experiencing an exhilarating evolution towards functional elegance, breathable sustainable fabrics, and minimalist street aesthetics. Consumers in Bangladesh and worldwide are increasingly looking for clothing that balances effortless style with everyday performance.
          </p>

          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '28px 0 12px' }}>
            1. The Resurgence of Breathable Linens & Cottons
          </h3>
          <p style={{ marginBottom: '20px' }}>
            As temperatures soar during summer and monsoon seasons, lightweight linen-cotton blends and combed cotton t-shirts have become absolute wardrobe staples. Mandarin collars, neutral olive and earth tones, and relaxed fits provide a refined look that transitions effortlessly from day to evening wear.
          </p>

          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '28px 0 12px' }}>
            2. High-Impact Minimalist Accessories
          </h3>
          <p style={{ marginBottom: '20px' }}>
            A curated accessory choice can transform even the simplest jeans-and-tee combination into a deliberate fashion statement. Full-grain leather belts with automatic buckles and RFID-shielded slim bi-fold wallets provide subtle sophistication.
          </p>

          <div
            style={{
              padding: '24px',
              borderRadius: '12px',
              background: '#f8fafc',
              borderLeft: '4px solid #000000',
              margin: '32px 0',
            }}
          >
            <p style={{ fontStyle: 'italic', fontWeight: 600, color: '#0f172a' }}>
              &quot;Style is a way to say who you are without having to speak. Investing in versatile, quality-made pieces ensures your look stays timeless.&quot;
            </p>
          </div>

          <div style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
            <Link href="/shop" className="btn-see-all">
              Explore Our Collection <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
